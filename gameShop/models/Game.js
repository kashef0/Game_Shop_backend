

const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema(
  {
    rawgId: {
      type: Number,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    coverImage: {
      type: String,
      required: true,
    },
    description: {
      type: String, 
      required: true,
    },
    platforms: [
      {
        platform: {
          type: String,  
          required: true,
        },
      },
    ],
    genres: [
      {
        name: {
          type: String, 
          required: true,
        },
        image_background: {
          type: String, 
          required: true,
        },
      },
    ],
    releaseDate: {
      type: Date,  
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    rentalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    availableForRent: {
      type: Boolean,
      default: false,
    },
    metacritic: {
      type: Number,  
    },
    rating: {
      type: Number,  
      min: 0,
      max: 10,
    },
    updated: {
      type: Date,  
    },
    shortScreenshots: [
      {
        type: String, 
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Game', gameSchema);
