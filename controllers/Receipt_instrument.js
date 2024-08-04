const { StatusCodes } = require('http-status-codes');
const {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
} = require('../errors');
const Receipt_instrument = require('../models/Receipt_instrument');

const getAllReceipt_instrument = async (req, res) => {
  const { listNumber, receipt_instrument_Date, vendor_receipt_instrument } =
    req.query;

  const recepit_instrument_queryObject = {};

  if (listNumber) {
    recepit_instrument_queryObject.listNumber = listNumber;
  }

  if (receipt_instrument_Date) {
    recepit_instrument_queryObject.receipt_instrument_Date =
      receipt_instrument_Date;
  }

  if (vendor_receipt_instrument) {
    recepit_instrument_queryObject.vendor_receipt_instrument =
      vendor_receipt_instrument;
  }

  const receipt_instrument = await Receipt_instrument.find(
    recepit_instrument_queryObject
  );

  if (!receipt_instrument) {
    throw new BadRequestError('there is no receipt_instrument record yet');
  }

  res.status(StatusCodes.OK).json({ msg: 'success', receipt_instrument });
};

const getSingleReceipt_instrument = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new BadRequestError('please provide id ');
  }

  const receipt_instrument = await Receipt_instrument.findOne({
    _id: id,
  });

  if (!receipt_instrument) {
    throw new NotFoundError('there is no such record in database');
  }

  res.status(StatusCodes.OK).json({ msg: 'success', receipt_instrument });
};

const getSingleReceipt_instrumentByCompany = async (req, res) => {
  const { company } = req.params;

  if (!company) {
    throw new BadRequestError('please provide company name  ');
  }

  const receipt_instrument = await Receipt_instrument.find({
    vendor_receipt_instrument: company,
  });

  if (!receipt_instrument) {
    throw new NotFoundError('there is no such record in database');
  }

  res.status(StatusCodes.OK).json({ msg: 'success', receipt_instrument });
};

const getSingleReceipt_instrumentByDate = async (req, res) => {
  const { date } = req.params;

  if (!date) {
    throw new BadRequestError('please provide date ');
  }

  const receipt_instrument = await Receipt_instrument.find({
    receipt_instrument_Date: date,
  });

  if (!receipt_instrument) {
    throw new NotFoundError('there is no such record in database');
  }

  res.status(StatusCodes.OK).json({ msg: 'success', receipt_instrument });
};

const createReceipt_instrument = async (req, res) => {
  const {
    vendor_receipt_instrument,
    receipt_instrument_sum,
    receipt_instrument_date,
    listNumber,
    moneyTransferWay,
    moneyTransferDate,
    moneyTransferCode,
  } = req.body;
  const adminstrator = req.user.userId;
  if (!listNumber) {
    throw new BadRequestError('please provide listNumber');
  }

  if (!vendor_receipt_instrument) {
    throw new BadRequestError('please provide vendor name ');
  }

  if (!receipt_instrument_sum) {
    throw new BadRequestError('please provide vendor paid bill ');
  }

  if (!adminstrator) {
    throw new BadRequestError('please provide adminstrator id');
  }

  if (!receipt_instrument_date) {
    throw new BadRequestError('please provide date paid bill ');
  }

  if (!moneyTransferWay) {
    throw new BadRequestError('please provide moeny tarsfter way  ');
  }

  if (!moneyTransferDate) {
    throw new BadRequestError('please provide moeny tarsfter date  ');
  }

  /* const receipt_instrument_bill = await Receipt_instrument.findOne({
    listNumber,
    vendor_receipt_instrument,
  });
  if (receipt_instrument_bill) {
    throw new UnauthorizedError(
      'recepit_instrument List number for this company  is already existed in database '
    );
  } */

  const receipt_instrument_bill_create = await Receipt_instrument.create({
    receipt_instrument_Date: receipt_instrument_date,
    receipt_instrument_sum: receipt_instrument_sum,
    vendor_receipt_instrument: vendor_receipt_instrument,
    adminstrator,
    listNumber: listNumber,
    moneyTransferWay,
    moneyTransferDate,
    moneyTransferCode,
  });

  res
    .status(StatusCodes.CREATED)
    .json({ msg: 'success', receipt_instrument_bill_create });
};

const deleteReceipt_instrument = async (req, res) => {
  const { id } = req.params;

  const receipt_instrument = await Receipt_instrument.findOne({
    _id: id,
  });

  if (!receipt_instrument) {
    throw new NotFoundError('there is no such record in database');
  }

  const delete_receipt_instrument = await Receipt_instrument.deleteOne({
    _id: id,
  });

  res
    .status(StatusCodes.ACCEPTED)
    .json({ msg: 'success', delete_receipt_instrument });
};

const updateReceipt_instrument = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new BadRequestError('please provide id ');
  }

  const receipt_instrument = await Receipt_instrument.findOne({
    _id: id,
  });

  if (!receipt_instrument) {
    throw new NotFoundError('there is no such record in database');
  }

  const update_receipt_instrument = await Receipt_instrument.findOneAndUpdate(
    {
      _id: id,
    },
    req.body,
    { runValidators: true, trim: true }
  );

  await update_receipt_instrument.save();

  res
    .status(StatusCodes.ACCEPTED)
    .json({ msg: 'success', update_receipt_instrument });
};

module.exports = {
  getAllReceipt_instrument,
  getSingleReceipt_instrument,
  createReceipt_instrument,
  updateReceipt_instrument,
  deleteReceipt_instrument,
  getSingleReceipt_instrumentByCompany,
  getSingleReceipt_instrumentByDate,
};
