const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true
    },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    }
  },
  { timestamps: true }
);

const listSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['Electronics', 'Books', 'Clothing', 'Furniture', 'Toys', 'Food']
    },
    price: {
      type: Number,
      require: true,
    },
    image: {
      type: String,
      require: true,
    },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    reviews: [reviewSchema]
  },
  { timestamps: true } 
);

const List = mongoose.model('List', listSchema);

module.exports = List;
