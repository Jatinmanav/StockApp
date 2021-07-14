import OrderServices from '../services/security';

const test = async (req, res) => res.status(200).json({
  message: 'success',
});

const createOrder = async (req, res) => {
  const order = req.body;
  try {
    const result = await OrderServices.createOrder(order);
    return res.status(200).json({
      message: result,
    });
  } catch (err) {
    if (err.message === OrderServices.customErrorMessages.invalidOperation) {
      return res.status(422).json({
        message: err.message,
      });
    }
    return res.status(500).json({
      message: err.message,
    });
  }
};

const updateOrder = async (req, res) => {
  const order = req.body;
  const orderId = req.params.id;
  try {
    const result = await OrderServices.updateOrder(orderId, order);
    return res.status(200).json({
      message: result,
    });
  } catch (err) {
    if (err.message === OrderServices.customErrorMessages.invalidOperation) {
      return res.status(422).json({
        message: err.message,
      });
    }
    return res.status(500).json({
      message: err.message,
    });
  }
};

const deleteOrder = async (req, res) => {
  const orderId = req.params.id;
  try {
    const result = await OrderServices.deleteOrder(orderId);
    return res.status(200).json({
      message: result,
    });
  } catch (err) {
    if (err.message === OrderServices.customErrorMessages.invalidOperation) {
      return res.status(422).json({
        message: err.message,
      });
    }
    return res.status(500).json({
      message: err.message,
    });
  }
};

const getTrades = async (req, res) => {
  try {
    const result = await OrderServices.getTrades();
    return res.status(200).json({
      message: result,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

const getPortfolio = async (req, res) => {
  try {
    const result = await OrderServices.getPortfolio();
    return res.status(200).json({
      message: result,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

const getReturns = async (req, res) => {
  try {
    const result = await OrderServices.getReturns();
    return res.status(200).json({
      message: result,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

export default {
  test,
  createOrder,
  updateOrder,
  deleteOrder,
  getTrades,
  getPortfolio,
  getReturns,
};
