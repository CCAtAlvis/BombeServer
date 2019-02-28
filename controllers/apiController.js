const User = require('../models/User');

const message = () => {
  let message = {
    status: 'success',
    message: 'yeeee its success',
    data: 'le data le'
  }

  return message;
}

const login = (req, res) => {
  const email = req.body.email;
  const password = req.query.password;
  console.log(email, password);

  User.findOne({email: email}, (err, doc) => {
    if (err) {
      throw err;
    }

    if (doc) {
      if (doc.password === password) {
      } else {
      }
    } else {
    }
  });
}

module.exports = {
  login
}
