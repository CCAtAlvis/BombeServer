const User = require('../models/User');

const login = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  // console.log(email, password);

  User.findOne({email: email}, (err, doc) => {
    if (err) {
      throw err;
    }

    if (doc) {
      // console.log(doc);
      if(doc.password === password) {
        req.session.user = doc;
        req.session.save((err) => {
          if (err) {
            throw err;
          }

          res.redirect('/users/');
        });

      } else {
        console.log('username or passowrd incorrect');
      }
    } else {
      console.log('no such user');
    }
  });
}

const viewLogin = (req, res) => {
  if(req.session.user) {
    res.redirect('/users')
  } else {
    res.render('users/login');
  }
}


const register = (req, res) => {
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

  user.save((err, doc) => {
    if (err) {
      res.send('some error try again later');
      throw err;
    }

    // console.log(doc);
    req.session.user = doc;
    req.session.save((err) => {
      if (err) {
        throw err;
      }

      res.redirect('/users/');
    });
  })
}

const viewRegister = (req, res) => {
  if(req.session.user) {
    res.redirect('/users')
  } else {
    res.render('users/register');
  }
}

const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
}

module.exports = {
  login,
  viewLogin,
  register,
  viewRegister,
  logout,
}
