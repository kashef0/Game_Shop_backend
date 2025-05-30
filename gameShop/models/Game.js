const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema(
  {
    rawgId: {
      type: Number,
      required: [true, 'Game ID (rawgId) is required'],
      unique: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be at least 0'],
    },
    rentalPrice: {
      type: Number,
      required: [true, 'Rental price is required'],
      min: [0, 'Rental price must be at least 0'],
    },
    stock: {
      type: Number,
      required: [true, 'Stock is required'],
      default: 0,
      min: [0, 'Stock cannot be negative'],
    },
    availableForRent: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Game', gameSchema);
