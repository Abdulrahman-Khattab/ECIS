const mongoose = require('mongoose');
const ProductSchema = require('./product');
const { BadRequestError } = require('../errors');

const { timeStampFormat, getMonthName } = require('../utils/timeStampsFormat');

const SingleOrderItemSchema = mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  amount: { type: Number, required: true },
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: true,
  },
});

const OrderSchema = mongoose.Schema(
  {
    subtotal: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    orderItems: [SingleOrderItemSchema],
    status: {
      type: String,
      enum: ['pending', 'success', 'failed', 'paid', 'delivered', 'canceled'],
      default: 'pending',
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    clientSecret: {
      type: String,
      required: true,
    },
    paymentIntentId: {
      type: String,
    },

    orderDate: {
      type: String,
      default: () => {
        const currentDate = timeStampFormat();
        return currentDate;
      },
    },

    orderUpadtedDate: {
      type: String,
      default: 'N/A',
    },

    orderYear: {
      type: String,
      default: () => {
        const currentYear = new Date();
        return currentYear.getFullYear();
      },
    },
    orderMonth: {
      type: String,
      default: () => {
        const currentMonth = getMonthName();
        return currentMonth;
      },
    },
    orderDay: {
      type: String,
      default: () => {
        const currentDate = new Date();
        return currentDate.getDate();
      },
    },
  },
  { timestamps: true }
);

OrderSchema.post('save', async function () {
  this.orderUpadtedDate = timeStampFormat();

  // change made here 12/2 2023 at 12:50 AM

  for (const orderItem of this.orderItems) {
    const product = await ProductSchema.findById({ _id: orderItem.product });
    if (orderItem.amount > product.inventory) {
      throw new BadRequestError(
        `Your order ${product.name} excced what is in the inventory`
      );
    }
    product.inventory = product.inventory - orderItem.amount;
    await product.save();
  }
});

module.exports = mongoose.model('Order', OrderSchema);
