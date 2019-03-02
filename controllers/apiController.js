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

const test = (req, res) => {
  const body = req.body;
  const query = req.query;
  const params = req.params;

  const response = {
    status: 'success',
    message: 'success hua ne! aur kya chahiye',
    data: {
      body: body,
      query: query,
      params: params
    }
  }

  res.json(response);
}

module.exports = {
  login,
  test
}
