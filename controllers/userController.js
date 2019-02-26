const User = require('../models/User');

const login = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  console.log(email, password);

  User.findOne({email: email, password: password})
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
  });
}

const viewLogin = (req, res) => {
  res.send('hehe');
}

const register = (req, res) => {

}

const viewRegister = (req, res) => {
  const email = req.body.email;
  const name = req.body.name;
  const contact = req.body.contact;
  const password = req.body.password;
  const repassword = req.body.repassword;

  if (password !== repassword) {
    console.log('password not same');
    res.send('password not same');
    return;
  }

  const user = new User({
    email: email,
    name: name,
    contact: contact,
    password: password,
    role: 'user'
  });

  user.save()
  .then((err, doc) => {
    if (err) {
      res.send('some error try again later');
      throw err;
    }

    console.log(doc);
    res.json(doc);
  })
}


module.exports = {
  login,
  viewLogin,
  register,
  viewRegister
}
