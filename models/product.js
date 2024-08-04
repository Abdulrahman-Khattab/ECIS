const mongoose = require('mongoose');
const timeStampFormat = () => {
  const date = new Date();

  const formatedDate = date.toLocaleDateString('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false, // Use 24-hour format);
  });
  return formatedDate;
};

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, 'Please provide product name'],
    maxlength: [100, 'Name can not be more than 100 characters'],
  },
  sellPrice: {
    type: Number,
    required: [true, 'Please provide product selling price'],
    default: 0,
  },

  originalPrice: {
    type: Number,
    required: [true, 'Please provide product original Price'],
    default: 0,
  },
  description: {
    type: String,
    required: [true, 'Please provide product description'],
    maxlength: [1000, 'Description can not be more than 1000 characters'],
  },
  image: {
    type: String,
    // default: '/uploads/example.jpeg',
  },
  category: {
    type: String,
    required: [true, 'Please provide product category'],
    trim: true,
  },

  department: {
    type: String,
    required: [true, 'Please provide product department'],
    trim: true,
  },

  company: {
    type: String,
    required: [true, 'Please provide company'],
    trim: true,
  },
  color: {
    type: String,
    default: 'none',
    trim: true,
  },

  barcode: {
    type: String,
    default: 'N/A',
  },
  featured: {
    type: Boolean,
    default: false,
  },
  freeShipping: {
    type: Boolean,
    default: false,
  },
  inventory: {
    type: Number,
    required: true,
    default: 1,
  },
  averageRating: {
    type: Number,
    default: 0,
  },
  numOfReviews: {
    type: Number,
    default: 0,
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  productDateEntery: {
    type: String,

    default: () => {
      const currentDate = timeStampFormat();
      return currentDate;
    },
  },

  productExpirationDate: {
    type: String,
    default: 'N/A',
  },

  productUpdateDate: {
    type: String,
    default: 'N/A',
  },
});

ProductSchema.post('findOneAndUpdate', async function (doc) {
  doc.productUpdateDate = timeStampFormat();
  await doc.save();
  // change made here 3/15 2024 at 6:11 PM
});

ProductSchema.pre('validate', function (next) {
  if (this.barcode == 0) {
    this.barcode = 'N/A';
  }
  next();
});

module.exports = mongoose.model('Product', ProductSchema);
