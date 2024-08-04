const Product = require('../models/product');
const { BadRequestError, NotFoundError } = require('../errors');
const path = require('path');

const createProduct = async (req, res) => {
  const {
    name,
    sellPrice,
    description,
    category,
    company,
    color,
    originalPrice,
    department,
  } = req.body;

  /*console.log(name);
  console.log(sellPrice);
  console.log(description);
  console.log(category);
  console.log(company);
  console.log(originalPrice);
  console.log(department);
  console.log(color); */

  if (
    !name ||
    !sellPrice ||
    !description ||
    !category ||
    !company ||
    !originalPrice ||
    !department ||
    !color
  ) {
    throw new BadRequestError('Please provide all value ');
  }

  req.body.user = req.user.userId;

  if (!req.files) {
    throw new BadRequestError('please provide file');
  }

  const imageValue = req.files.image;

  if (!imageValue.mimetype.startsWith('image')) {
    throw new BadRequestError('please provide image');
  }

  const size = 1024 * 1024 * 30;
  if (imageValue.size > size) {
    throw new BadRequestError(
      'please provide image that size is less than 30MB'
    );
  }

  const imagePath = path.join(
    __dirname,
    `../public/photo/` + `${imageValue.name}`
  );

  await imageValue.mv(imagePath);

  const image = `/photo/${imageValue.name}`;
  console.log(image);

  const product = await Product.create({ ...req.body, image });

  res.json({ msg: 'Product created successfully', product });
};

const getAllProducts = async (req, res) => {
  const {
    name,
    company,
    color,
    freeShipping,
    category,
    department,
    numericFilters,
  } = req.query;
  const queryObject = {};

  if (name) {
    queryObject.name = { $regex: name, $options: 'i' };
  }

  if (company) {
    queryObject.company = company;
  }

  if (color) {
    queryObject.color = color;
  }

  if (freeShipping) {
    queryObject.freeShipping = freeShipping;
  }

  if (category) {
    queryObject.category = category;
  }
  if (department) {
    queryObject.department = department;
  }

  if (numericFilters) {
    const operatorMap = {
      '>': '$gt',
      '>=': '$gte',
      '=': '$eq',
      '<': '$lt',
      '<=': '$lte',
    };
    const regEx = /\b(>|>=|=|<|<=)\b/g;
    let filters = numericFilters.replace(
      regEx,
      (match) => `-${operatorMap[match]}-`
    );

    const options = ['sellPrice', 'rating'];
    filters = filters.split(',').forEach((item) => {
      const [field, operator, value] = item.split('-');

      if (options.includes(field)) {
        queryObject[field] = { [operator]: Number(value) };
        console.log(queryObject);
      }
    });
  }

  const products = await Product.find(queryObject);

  res.json(products);
};

const getSingleProduct = async (req, res) => {
  const { id } = req.params;
  const product = await Product.findOne({ _id: id });

  if (!product) {
    throw new NotFoundError('There is no such product ');
  }

  res.json(product);
};

const getSingleProductByBarCode = async (req, res) => {
  const { barcode } = req.params;
  const product = await Product.findOne({ barcode: barcode });

  if (!product) {
    throw new NotFoundError('There is no such product ');
  }

  res.json(product);
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const product = await Product.findOne({ _id: id });
  if (!product) {
    throw new NotFoundError('There is no such product ');
  }
  await product.deleteOne({ _id: id });
  res.json({ msg: 'Product removed successfully' });
};

const updateProduct = async (req, res) => {
  const { id: productId } = req.params;

  console.log(productId);
  console.log(req.body);

  if (req.files) {
    console.log('request files applied ');
    const imageValue = req.files.image;

    if (!imageValue.mimetype.startsWith('image')) {
      throw new BadRequestError('please provide image');
    }

    const size = 1024 * 1024 * 30;
    if (imageValue.size > size) {
      throw new BadRequestError(
        'please provide image that size is less than 30MB'
      );
    }

    const imagePath = path.join(
      __dirname,
      `../public/photo/` + `${imageValue.name}`
    );

    await imageValue.mv(imagePath);

    const image = `/photo/${imageValue.name}`;

    const product = await Product.findOneAndUpdate(
      { _id: productId },
      { ...req.body, image },
      {
        new: true,
        runValidators: true,
      }
    );

    await product.save();

    if (!product) {
      throw new CustomError.NotFoundError(`No product with id : ${productId}`);
    }

    res.json({ product });
  } else {
    console.log('we are appiled else ');
    const product = await Product.findOneAndUpdate(
      { _id: productId },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    await product.save();

    if (!product) {
      throw new CustomError.NotFoundError(`No product with id : ${productId}`);
    }

    res.json({ product });
  }
};

const uploadImage = async (req, res) => {
  if (!req.files) {
    throw new BadRequestError('please provide file');
  }

  const image = req.files.image;

  if (!image.mimetype.startsWith('image')) {
    throw new BadRequestError('please provide image');
  }

  const size = 1024 * 1024 * 30;
  if (image.size > size) {
    throw new BadRequestError(
      'please provide image that size is less than 30MB'
    );
  }

  const imagePath = path.join(__dirname, `../public/photo/` + `${image.name}`);

  await image.mv(imagePath);

  const product = await Product.findOne({ _id: req.params.id });
  if (!product) {
    throw new BadRequestError('there is no such product in database');
  }

  product.image = `/photo/${image.name}`;

  await product.save();

  res.json(product);
};

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  deleteProduct,
  updateProduct,
  uploadImage,
  getSingleProductByBarCode,
};
