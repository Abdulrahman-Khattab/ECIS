const mongoose = require('mongoose');
const timeStampFormat = require('../utils/timeStampsFormat');

const ReviewSchema = mongoose.Schema({
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: [true, 'Please provide rating'],
  },
  title: {
    type: String,
    trim: true,
    required: [true, 'Please provide review title'],
    maxlength: 100,
  },
  comment: {
    type: String,
    required: [true, 'Please provide review text'],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: true,
  },

  reviewDate: {
    type: String,
    default: () => {
      const currentDate = timeStampFormat();
      return currentDate;
    },
  },
  reviewUpdated: {
    type: String,
    default: 'N/A',
  },
});

ReviewSchema.index({ user: 1, product: 1 }, { unique: true });

ReviewSchema.statics.calculateAvgRating = async function (productId) {
  const result = await this.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        numberOfReview: { $sum: 1 },
      },
    },
  ]);

  try {
    await this.model('Product').findOneAndUpdate(
      { _id: productId },
      {
        averageRating: result[0]?.averageRating || 0,
        numOfReviews: result[0]?.numberOfReview || 0,
      }
    );
  } catch (error) {
    console.log(error);
  }
};

ReviewSchema.post('save', async function () {
  await this.constructor.calculateAvgRating(this.product);
  this.reviewUpdated = timeStampFormat();
});

ReviewSchema.post('findOneAndDelete', async function (doc) {
  console.log(doc);
  await doc.constructor.calculateAvgRating(doc.product);
});

module.exports = mongoose.model('Review', ReviewSchema);
