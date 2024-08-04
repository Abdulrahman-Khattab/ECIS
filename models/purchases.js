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

const purchaseSchema = new mongoose.Schema({
  listNumber: {
    type: Number,
    required: [true, 'please provide purchase List number '],
    unique: false,
  },

  purchaseDateEntery: {
    type: String,
    default: () => {
      const currentDate = timeStampFormat();
      return currentDate;
    },
  },

  purchaseDate: {
    type: String,
    maxLength: 10,
    required: [true, 'please provide date of purchase'],
  },

  purchaseUpdatedInfoDate: {
    type: String,
    default: 'N/A',
  },

  vendor: {
    type: String,
    required: [true, 'please provde vendor'],
  },

  purchaseSum: {
    type: Number,
    required: [true, 'please provide whole purchase sum'],
    min: 1,
  },

  adminstrator: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: [true, 'please provide adminstrator id '],
  },
});

purchaseSchema.post('findOneAndUpdate', async function (doc) {
  doc.purchaseUpdatedInfoDate = timeStampFormat();
  await doc.save();
});

purchaseSchema.index({ listNumber: 1, vendor: 1 }, { unique: true });

module.exports = mongoose.model('Purchases', purchaseSchema);
