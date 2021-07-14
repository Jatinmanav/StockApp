import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  tickerSymbol: {
    type: String,
    required: true,
    index: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

const Order = mongoose.model('Order', OrderSchema);

export default Order;
