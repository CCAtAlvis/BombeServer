const User = require('../models/User');

const index = (req, res) => {
  console.log('show the index here');
  if(!req.session.user) {
    res.redirect('/users/login');
  } else {
    // res.send('hello user!');
    res.render('users/index');
  }
}

const login = (req, res) => {
  const phone = req.body.contact;
  const password = req.body.password;
  // console.log(email, password);

  User.findOne({phone: phone}, (err, doc) => {
    if (err) {
      throw err;
    }
    if (doc) {
      // console.log(doc);
      if (doc.active) {
        if(doc.password === password) {
          req.session.user = doc;
          req.session.save((err) => {
            if (err) {
              throw err;
            }
            res.redirect('/users');
          });
  
        } else {
          console.log('username or passowrd incorrect');
        }
      } else {
        console.log('Account activated!');
      }
      
    } else {
      console.log('no such user');
    }
  });
}

const viewVerify = (req, res) => {
  if (req.session.user) {
    res.redirect('/users');
  }
  else {
    res.render('users/verify');
  }
}

const verify  = (req, res) => {
  const id = req.session.user._id;
  const otp = req.body.otp;

  User.findById({_id: id}, (err, doc) => {
    if (err) {
      throw err;
    }
    if (doc) {
      // console.log(doc);
      if(doc.otp === otp) {
        res.redirect('/users');
      } else {
        console.log('Incorrect OTP');
      }
    } else {
      console.log('no such user');
    }
  });
}

const viewLogin = (req, res) => {
  if(req.session.user) {
    res.redirect('/users');
  } else {
    res.render('users/login');
  }
}


const register = (req, res) => {
  // const email = req.body.email;
  const name = req.body.name;
  const contact = req.body.contact;
  const password = req.body.password;
  // const repassword = req.body.repassword;
  const role = req.body.role;

  // if (password !== repassword) {
  //   console.log('password not same');
  //   res.send('password not same');
  //   return;
  // }
  let otp = Math.random()*100000;
  otp = parseInt(otp);

  const user = new User({
    // email: email,
    name: name,
    contact: contact,
    password: password,
    role: role,
    otp: otp
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
      //TO DO SEND OTP USING APIs
      // change /users to /verify
      res.redirect('/verify');
    });
  })
}

const viewRegister = (req, res) => {
  if(req.session.user) {
    res.redirect('/users');
  } else {
    res.render('users/register');
  }
}

const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
}

module.exports = {
  index,
  login,
  viewLogin,
  register,
  viewRegister,
  logout,
  verify,
  viewVerify
}
