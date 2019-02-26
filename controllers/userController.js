const User = require('../models/User');

const login = (req, res) => {
  let username = req.body.username;
  let password = req.body.password;

  User.findOne({username: username, password: password})
  .then((err, doc) => {
    if (err) {
      throw err;
    }

    if (doc) {
      // TODO:
      // save user session
    } else {
      console.log("no such user");
    }
  })
}

const register = (req, res) => {

}

module.exports = {
    login,
    register
}
