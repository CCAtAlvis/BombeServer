const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  authUsers: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  }],
  refCode: {
    type: String,
    required: true
  },
  users: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
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
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('patient', patientSchema);
