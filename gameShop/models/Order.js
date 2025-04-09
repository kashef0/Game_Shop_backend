const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  game: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  isRental: {
    type: Boolean,
    default: false
  },
  rentalDuration: {
    type: Number,
    min: 1,
    max: 30
  },
  priceAtPurchase: {
    type: Number,
    required: true
  }
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    items: [orderItemSchema],
    totalPrice: {
      type: Number,
      required: true,
      min: 0
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ['Credit Card', 'PayPal', 'Swish']
    },
    isPaid: {
      type: Boolean,
      default: false
    },
    paidAt: {
      type: Date
    },
    isDelivered: {
      type: Boolean,
      default: false
    },
    deliveredAt: {
      type: Date
    },
    rentalReturnDate: Date
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);