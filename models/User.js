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
  },
  dateOfBirth: {
    type: Date,
  },
  contact: {
    type: Number,
    minlength: 10,
    maxlength: 10,
    unique: true
  },
  // address: {
  //   type: String
  // },
  role: {
    type: String,
    required: true,
    enum: ['user', 'doctor', 'nurse', 'developer', 'other-staff']
  },
  app: {
    deviceToken: {
      type: String
    }
  },
  otp: {
    type: String
  },
  verified: {
    type: Boolean,
    required: true,
    default: false
  },
  hospCode: {
    type: String,
    default: 'MUM'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
