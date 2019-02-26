const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  gender: {
    type: String,
    enum: ['male', 'female', 'others']
  },
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true
  },
  dateOfBirth: {
    type: Date,
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
