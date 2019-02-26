const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  gender: {
    type: String,
    required: true,
    enum: ['male', 'female', 'others']
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  imageUrl: {
    type: String,
  },
  contact: {
    type: Number,
    minlength: 10,
    maxlength: 10
  },
  address: {
    type: String
  },
  role: {
    type: String,
    required: true,
    enum: ['patient', 'user', 'staff', 'doctor', 'developer']
  },
  app: {
    deviceToken: {
      type: String
    }
  },
  tos: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);