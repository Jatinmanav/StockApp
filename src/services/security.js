import Order from '../models/Order';

const customErrorMessages = {
  insufficientSecurities: 'Insufficient Securities',
  invalidOperation: 'Invalid Operation',
};

/**
 * Get the total number of the specified stock currently owned.
 * @param {string} tickerSymbol - The Symbol of the stock to query.
 * @return {number} Quantity of stocks present in portfolio.
 */
const getSecurityQuantity = async (tickerSymbol) => {
  const result = await Order.aggregate([
    {
      $match: {
        tickerSymbol,
      },
    },
    {
      $group: {
        _id: '$tickerSymbol',
        total: {
          $sum: {
            $cond: [
              { $eq: ['$type', 'BUY'] },
              '$quantity',
              { $multiply: [-1, '$quantity'] },
            ],
          },
        },
      },
    },
  ]);

  return result.length > 0 ? result[0].total : 0;
};

/**
 * Create a new order document in the db.
 * @param {object} orderObject - Order object to be created.
 * @return {object} Created object document.
 */
const createOrder = async (orderObject) => {
  const order = new Order(orderObject);

  if (order.type === 'BUY') {
    const result = await order.save();
    return result;
  }

  const session = await Order.startSession();
  try {
    session.startTransaction();
    const securityQuantity = await getSecurityQuantity(order.tickerSymbol);

    if (securityQuantity >= order.quantity) {
      const result = await order.save();
      return result;
    }
  } catch (err) {
    session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }

  throw new Error(customErrorMessages.insufficientSecurities);
};

/**
 * Update an existing order document in the db.
 * @param {string} objectId - Id of document to be updated.
 * @param {object} updatedOrder - Data to be updated in the document.
 * @return {object} Updated order document.
 */
const updateOrder = async (objectId, updatedOrder) => {
  const session = await Order.startSession();

  try {
    session.startTransaction();
    const order = await Order.findById(objectId);
    const updatedOrderObject = { ...updatedOrder };
    let result;

    if (!updatedOrder.type) {
      updatedOrderObject.type = order.type;
    }
    if (!updatedOrder.tickerSymbol) {
      updatedOrderObject.tickerSymbol = order.tickerSymbol;
    }
    if (!updatedOrder.quantity) {
      updatedOrderObject.quantity = order.quantity;
    }
    if (!updatedOrder.price) {
      updatedOrderObject.price = order.price;
    }

    const securityQuantity = await getSecurityQuantity(order.tickerSymbol);

    let updatedSecurityQuantity = await getSecurityQuantity(updatedOrderObject.tickerSymbol);

    if (order.tickerSymbol === updatedOrderObject.tickerSymbol) {
      if (order.type === 'BUY') updatedSecurityQuantity -= order.quantity;
      else updatedSecurityQuantity += order.quantity;
    }

    if (
      order.tickerSymbol !== updatedOrderObject.tickerSymbol
      && order.type === 'BUY'
      && securityQuantity < order.quantity
    ) {
      throw new Error(customErrorMessages.invalidOperation);
    } else if (
      order.type !== updatedOrderObject.type
      && order.type === 'BUY'
      && securityQuantity < (order.quantity + updatedOrderObject.quantity)
    ) {
      throw new Error(customErrorMessages.invalidOperation);
    } else if (
      order.quantity !== updatedOrderObject.quantity
      && (
        (order.type === 'BUY' && securityQuantity < (order.quantity - updatedOrderObject.quantity))
        || (order.type === 'SELL' && securityQuantity < (updatedOrderObject.quantity - order.quantity))
      )
    ) {
      throw new Error(customErrorMessages.invalidOperation);
    }

    Object.keys(updatedOrderObject).forEach((key) => {
      order[key] = updatedOrderObject[key];
    });

    if (order.type === 'BUY') {
      result = await order.save();
      return result;
    }

    if (updatedSecurityQuantity >= order.quantity) {
      result = await order.save();
      return result;
    }

    throw new Error(customErrorMessages.invalidOperation);
  } catch (err) {
    session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
};

/**
 * Delete a document from the db.
 * @param {string} objectId - Id of document to be deleted.
 * @return {object} Deleted order document.
 */
const deleteOrder = async (objectId) => {
  const session = await Order.startSession();
  let result;

  try {
    session.startTransaction();
    const order = await Order.findById(objectId);
    const securityQuantity = await getSecurityQuantity(order.tickerSymbol);

    if (order.type === 'BUY' && order.quantity > securityQuantity) {
      throw new Error(customErrorMessages.invalidOperation);
    }
    result = await Order.findByIdAndRemove(objectId);
  } catch (err) {
    session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }

  return result;
};

/**
 * Get all the securities and their respective orders.
 * @return {object[]} Array of all securities and their respective orders.
 */
const getTrades = async () => {
  const result = await Order.aggregate([
    {
      $group: {
        _id: '$tickerSymbol',
        orders: {
          $push: {
            id: '$_id',
            type: '$type',
            quantity: '$quantity',
            price: '$price',
          },
        },
      },
    },
  ]);

  return result;
};

/**
 * Get a summary of all stocks present in the portfolio along with final quantity and average price.
 * @return {object[]} Array of all securities currently owned.
 */
const getPortfolio = async () => {
  const result = await Order.aggregate([
    {
      $group: {
        _id: '$tickerSymbol',
        totalPrice: {
          $sum: {
            $cond: [
              { $eq: ['$type', 'BUY'] },
              { $multiply: ['$quantity', '$price'] },
              0,
            ],
          },
        },
        totalQuantityBought: {
          $sum: {
            $cond: [
              { $eq: ['$type', 'BUY'] },
              '$quantity',
              0,
            ],
          },
        },
        quantity: {
          $sum: {
            $cond: [
              { $eq: ['$type', 'BUY'] },
              '$quantity',
              { $multiply: [-1, '$quantity'] },
            ],
          },
        },
      },
    },
    {
      $project: {
        quantity: 1,
        averagePrice: {
          $divide: ['$totalPrice', '$totalQuantityBought'],
        },
      },
    },
    {
      $match: {
        quantity: {
          $not: {
            $eq: 0,
          },
        },
      },
    },
  ]);

  return result;
};

/**
 * Get the expected returns of the stocks currently present in the portfolio.
 * @return {number} Total return of stocks currently present in portfolio.
 */
const getReturns = async () => {
  const currentPrice = 100;
  const result = await Order.aggregate([
    {
      $group: {
        _id: '$tickerSymbol',
        totalPrice: {
          $sum: {
            $cond: [
              { $eq: ['$type', 'BUY'] },
              { $multiply: ['$quantity', '$price'] },
              0,
            ],
          },
        },
        totalQuantityBought: {
          $sum: {
            $cond: [
              { $eq: ['$type', 'BUY'] },
              '$quantity',
              0,
            ],
          },
        },
        quantity: {
          $sum: {
            $cond: [
              { $eq: ['$type', 'BUY'] },
              '$quantity',
              { $multiply: [-1, '$quantity'] },
            ],
          },
        },
      },
    },
    {
      $project: {
        quantity: 1,
        averagePrice: {
          $divide: ['$totalPrice', '$totalQuantityBought'],
        },
      },
    },
    {
      $group: {
        _id: null,
        returns: {
          $sum: {
            $multiply: [
              {
                $subtract: [
                  currentPrice,
                  '$averagePrice',
                ],
              },
              '$quantity',
            ],
          },
        },
      },
    },
  ]);

  return result.length > 0 ? result[0].returns : 0;
};

export default {
  customErrorMessages,
  createOrder,
  updateOrder,
  deleteOrder,
  getTrades,
  getPortfolio,
  getReturns,
};
