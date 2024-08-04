const {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} = require('../errors');

const Purchase = require('../models/purchases');
const { StatusCodes } = require('http-status-codes');

const getAllPurchases = async (req, res) => {
  const { vendor, purchaseDate, listNumber } = req.query;
  const queryobject = {};

  if (vendor) {
    queryobject.vendor = vendor;
  }

  if (purchaseDate) {
    queryobject.purchaseDate = purchaseDate;
  }

  if (listNumber) {
    queryobject.listNumber = listNumber;
  }

  const purchaseRecords = await Purchase.find(queryobject);
  if (!purchaseRecords) {
    throw new NotFoundError('there is no record about purchases ');
  }

  res.json({ msg: 'success', purchaseRecords });
};

const createPurchases = async (req, res) => {
  const { vendor, purchaseSum, listNumber, purchaseDate } = req.body;

  const adminstrator = (req.body.adminstrator = req.user.userId);
  if (!vendor) {
    throw new BadRequestError('please provide vendor name ');
  }

  if (!purchaseSum) {
    throw new BadRequestError('please provide purchase sum ');
  }

  if (!listNumber) {
    throw new BadRequestError('please provide purchase list Number ');
  }

  if (!purchaseDate) {
    throw new BadRequestError('please provide purchase list purchase Date ');
  }

  /* const maxPurchaseRecords = await Purchase.find({})
    .sort({ listNumber: -1 })
    .limit(1);

  if (!maxPurchaseRecords) {
    listNumber = (await Purchase.countDocuments()) + 1;
  }

  listNumber = maxPurchaseRecords[0].listNumber + 1; */

  const purchaseRecord = await Purchase.create({
    vendor,
    purchaseSum,
    listNumber,
    adminstrator,
    purchaseDate,
  });

  res.status(StatusCodes.CREATED).json({ msg: 'success', purchaseRecord });
};

const deletePurchases = async (req, res) => {
  const { id } = req.params;

  const purchaseRecord = await Purchase.findOne({
    _id: id,
  });

  if (!purchaseRecord) {
    throw new NotFoundError('there is no such record in database');
  }

  const deletedPurchaseRecord = await Purchase.deleteOne({
    _id: id,
  });

  res.status(StatusCodes.OK).json({ msg: 'success', deletedPurchaseRecord });
};

const updatePurchases = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new BadRequestError('please provide id');
  }

  const purchaseRecord = await Purchase.findOne({
    _id: id,
  });

  if (!purchaseRecord) {
    throw new BadRequestError('there is no such record database');
  }

  const updatedRecord = await Purchase.findOneAndUpdate({ _id: id }, req.body, {
    trim: true,
    runValidators: true,
  });

  // added to trigger time updating function
  await updatedRecord.save();

  res.status(StatusCodes.OK).json({ msg: 'success', updatedRecord });
};

const getSinglePurchases = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new BadRequestError('please provide id');
  }

  const purchaseRecord = await Purchase.findOne({
    _id: id,
  });

  if (!purchaseRecord) {
    throw new NotFoundError('there is no such record in database');
  }

  res.status(StatusCodes.OK).json({ msg: 'success', purchaseRecord });
};

const getSinglePurchasesByDate = async (req, res) => {
  const { date } = req.params;

  if (!date) {
    throw new BadRequestError('please provide list date');
  }

  const purchaseRecord = await Purchase.find({
    purchaseDate: date,
  }).populate('adminstrator');

  if (!purchaseRecord) {
    throw new NotFoundError('there is no such record in database');
  }

  res.status(StatusCodes.OK).json({ msg: 'success', purchaseRecord });
};

const getSinglePurchasesByCompany = async (req, res) => {
  const { company } = req.params;

  if (!company) {
    throw new BadRequestError('please provide list company');
  }

  const purchaseRecord = await Purchase.find({
    vendor: company,
  }).populate('adminstrator');

  if (!purchaseRecord) {
    throw new NotFoundError('there is no such record in database');
  }

  res.status(StatusCodes.OK).json({ msg: 'success', purchaseRecord });
};

module.exports = {
  getAllPurchases,
  createPurchases,
  deletePurchases,
  updatePurchases,
  getSinglePurchases,
  getSinglePurchasesByCompany,
  getSinglePurchasesByDate,
};
