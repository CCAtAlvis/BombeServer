const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  gender: {
    type: String,
    enum: ['male', 'female', 'others']
  },
  name: {
    type: String,
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true
  },
  dateOfBirth: {
    type: Date,
  },
  contact: {
    type: Number,
    minlength: 10,
    maxlength: 10
  },
  // address: {
  //   type: String
  // },
  role: {
    type: String,
    required: true,
    enum: ['patient', 'user', 'staff', 'doctor', 'nurse','developer']
  },
  app: {
    deviceToken: {
      type: String
    }
  },
  otp: {
    type: String
  },
  active: {
    type: Boolean,
    required: true,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
