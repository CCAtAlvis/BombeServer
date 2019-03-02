const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'John Doe'
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
    type: Number,
    unique: true
  },
  doctor: {
    type: Number,
    unique: true
  },
  refCode: {
    type: String,
    required: true
  },
  users: [{
    userCotact: {
      type: Number,
      unique: true
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
  },
  visitFloor: {
    type: Number,
    default: 16,
  },
  visitCeil: {
    type: Number,
    default: 20,
  },
  deleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('patient', patientSchema);
