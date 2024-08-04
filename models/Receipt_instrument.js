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

const receipt_instrument_schema = new mongoose.Schema({
  listNumber: {
    type: Number,
    required: [true, 'please provide purchase List number '],
  },

  receipt_instrument_Date_Entery: {
    type: String,
    default: () => {
      const currentDate = timeStampFormat();
      return currentDate;
    },
  },

  receipt_instrument_updated_info_Date: {
    type: String,
    default: 'N/A',
  },

  receipt_instrument_Date: {
    type: String,
    maxLength: 10,
    required: [true, 'please provide date of purchase'],
  },

  vendor_receipt_instrument: {
    type: String,
    required: [true, 'please provide vendor who should receive the receipt'],
  },

  receipt_instrument_sum: {
    type: Number,
    required: [true, 'please provide receit instrument paid sum '],
    min: 1,
  },

  adminstrator: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: [true, 'please provide adminstrator id '],
  },

  moneyTransferWay: {
    type: String,
    maxLength: 120,
    required: [true, 'please provide moeny transfer way'],
  },

  moneyTransferCode: {
    type: String,
    maxLnegth: 150,
    default: 'N/A',
  },
  moneyTransferDate: {
    type: String,
    max: 10,
    required: [true, 'please provide money transfer date '],
  },
});
receipt_instrument_schema.index(
  { listNumber: 1, vendor_receipt_instrument: 1 },
  { unique: true }
);

receipt_instrument_schema.post('findOneAndUpdate', async function (doc) {
  doc.receipt_instrument_updated_info_Date = timeStampFormat();
  await doc.save();
});

module.exports = mongoose.model(
  'Receipt_instrument',
  receipt_instrument_schema
);
