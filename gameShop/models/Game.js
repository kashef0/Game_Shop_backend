// const mongoose = require('mongoose');

// const gameSchema = new mongoose.Schema(
//   {
//     rawgId: {
//       type: Number,
//       required: true,
//       unique: true
//     },
//     title: {
//       type: String,
//       required: true,
//       trim: true
//     },
//     coverImage: {
//       type: String,
//       required: true
//     },
//     platforms: [String],
//     genres: [String],
//     releaseDate: Date,
//     price: {
//       type: Number,
//       required: true,
//       min: 0
//     },
//     rentalPrice: {
//       type: Number,
//       required: true,
//       min: 0
//     },
//     stock: {
//       type: Number,
//       required: true,
//       default: 0,
//       min: 0
//     },
//     availableForRent: {
//       type: Boolean,
//       default: false
//     },
//     isActive: {
//       type: Boolean,
//       default: true
//     }
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model('Game', gameSchema);
// gameSchema.js
const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema(
  {
    rawgId: {
      type: Number,
      required: true,
      unique: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    rentalPrice: {
      type: Number,
      required: true,
      min: 0
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
      min: 0
    },
    availableForRent: {
      type: Boolean,
      default: false
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Game', gameSchema);
