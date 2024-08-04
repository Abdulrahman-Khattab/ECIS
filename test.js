const Product = require('./models/product');
const { BadRequestError, NotFoundError } = require('./errors');
const path = require('path');

const updateProductNoRefactor = async (req, res) => {
  const { id: productId } = req.params;
  const {
    name,
    descrpition,
    category,
    department,
    numberOfReviews,
    sellPrice,
    originalPrice,
    averageRating,
    color,
    company,
  } = req.body;

  if (!productId) {
    throw new BadRequestError('please provide product ID ');
  }

  const product = await Product.findOneAndUpdate(
    { _id: productId },
    {
      name,
      descrpition,
      category,
      department,
      numberOfReviews,
      sellPrice,
      originalPrice,
      averageRating,
      color,
      company,
    },
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
};

const createProductNoRefactor = async (req, res) => {
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

  const product = await Product.create({ ...req.body });

  res.json({ msg: 'Product created successfully', product });
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

const updateProductRefactored = async (req, res) => {
  const { id: productId } = req.params;

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

const createProductRefactored = async (req, res) => {
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

  if (!name) {
    throw new BadRequestError('Please provide name ');
  }
  if (!sellPrice) {
    throw new BadRequestError('Please provide sellPrice ');
  }
  if (!description) {
    throw new BadRequestError('Please provide description ');
  }
  if (!category) {
    throw new BadRequestError('Please provide category ');
  }
  if (!company) {
    throw new BadRequestError('Please provide company ');
  }
  if (!color) {
    throw new BadRequestError('Please provide color ');
  }

  if (!originalPrice) {
    throw new BadRequestError('Please provide originalPrice ');
  }
  if (!department) {
    throw new BadRequestError('Please provide department ');
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

module.exports = { createProductNoRefactor };
