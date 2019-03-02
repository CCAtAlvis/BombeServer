const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'others']
  },
  contact: {
    type: Number,
    minlength: 10,
    maxlength: 10
  },
  hospCode: {
    type: String,
    required: true
  },
  email: {
    type: String,
  },
  // trustedUser: [{
  //   userCotact: {
  //     type: String,
  //     required: true
  //   }
  // }],
  // trustedUser: {
  //   userCotact: {
  //     type: String,
  //     required: true
  //   }
  // },
  trustedUser: {
    type: String,
    required: true
  },
  doctor: {
    type: String,
    required: true
  },
  refCode: {
    type: String,
    required: true
  },
  users: [{
    userCotact: {
      type: String,
      required: true
    },
    name: {
      type: String,
    },
    permission: {
      type: Boolean,
      default: false,
      required: true
    }
  }],
  pubStream: {
    type: Boolean,
    default: false,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('patient', patientSchema);
