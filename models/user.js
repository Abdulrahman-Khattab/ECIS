const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

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

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'please provide name'],
    mingLength: 2,
    maxLength: 40,
    trim: true,
  },

  password: {
    type: String,
    required: [true, 'please provide password'],
    mingLength: 6,
    maxLength: 50,
  },

  email: {
    type: String,
    required: [true, 'please provide password'],
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: ' please provide valid email',
    },
  },

  role: {
    type: String,
    required: [true, 'Please provide role'],
    enum: ['user', 'admin', 'owner', 'accountant', 'operator', 'manager'],
    default: 'user',
  },

  userDate: {
    type: String,
    default: () => {
      const currentDate = timeStampFormat();
      return currentDate;
    },
  },

  userUpdatedInfoDate: {
    type: String,
    default: 'N/A',
  },
});

userSchema.pre('save', async function () {
  // console.log(!this.isModified(this.password));
  //if (!this.isModified(this.password)) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  this.userUpdatedInfoDate = timeStampFormat();
});

userSchema.methods.comparePassword = async function (canidate) {
  const isPasswordcorrect = await bcrypt.compare(canidate, this.password);
  return isPasswordcorrect;
};

module.exports = mongoose.model('User', userSchema);
