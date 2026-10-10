const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'نام محصول الزامی است'],
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  price: {
    type: Number,
    required: [true, 'قیمت محصول الزامی است'],
    min: 0,
  },
  oldPrice: {
    type: Number,
    default: null,
  },
  category: {
    type: String,
    required: [true, 'دسته‌بندی محصول الزامی است'],
    enum: {
      values: ['tshirt', 'pants', 'jacket', 'shoes'],
      message: 'دسته‌بندی نامعتبر است',
    },
  },
  isRare: {
    type: Boolean,
    default: false,
  },
  mainImage: {
    type: String,
    default: '',
  },
  hoverImage: {
    type: String,
    default: '',
  },
  colors: {
    type: [String],
    default: [],
  },
  sizes: {
    type: [String],
    default: [],
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  numReviews: {
    type: Number,
    default: 0,
  },
  isNew: {
    type: Boolean,
    default: false,
  },
  isSale: {
    type: Boolean,
    default: false,
  },
  stock: {
    type: Number,
    required: [true, 'موجودی محصول الزامی است'],
    default: 10,
    min: 0,
  },
  discount: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Product', productSchema);