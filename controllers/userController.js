const User = require('../models/User');

const viewRegister = (req, res) => {
  if (!(typeof req.session.user === 'undefined') && !req.session.user.active) {
    //user is registered but is not verified
    res.render('users/verify');
  } else if(!(typeof req.session.user === 'undefined') && req.session.user.active ) {
    //user is registered and is verified
    res.redirect('/users');
  } else {
    //user has not registered yet
    res.render('users/register');
  }
}

const register = (req, res) => {
  const name = req.body.name;
  const contact = req.body.contact;
  const password = req.body.password;
  const role = req.body.role;
  let otp = Math.random()*10000;
  otp = parseInt(otp);

  const user = new User({
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
    req.session.user = doc;
    req.session.save((err) => {
      if (err) {
        throw err;
      }
      //user has registered so now he will verify account
      res.redirect('/verify');
    });
  })
}

//if no user logged in ,show login page else userIndex page
const index = (req, res) => {
  // if(!req.session.user) {
  //   res.redirect('/users/login');
  // } else {
  //   res.render('users/index');
  // }
  if (!(typeof req.session.user === 'undefined') && !req.session.user.active) {
    //user is registered/loggedIn but is not verified
    res.render('users/verify');
  } else if(!(typeof req.session.user === 'undefined') && req.session.user.active ) {
    //user is registered/loggedIn and is verified
    res.redirect('/users');
  } else {
    //user has to login
    res.render('users/login');
  }
}

//OTP verification 
const viewVerify = (req, res) => {
  // if (req.session.user.active) {
  //   res.redirect('/users');
  // }
  // else if(!req.session.user.active) {
  //   res.render('users/verify');
  // }
  if (!(typeof req.session.user === 'undefined') && !req.session.user.active) {
    //user is registered/loggedIn but is not verified
    res.render('users/verify');
  } else if(!(typeof req.session.user === 'undefined') && req.session.user.active ) {
    //user is registered/loggedIn and is verified
    res.redirect('/users');
  } else {
    //user has to login
    // res.render('users/login');
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
      if(doc.otp === otp) {
        res.redirect('/users');
      } else {
        console.log('Incorrect OTP');
        res.render('users/verify', {error:'Invalid OTP'});
      }
    } else {
      console.log('no such user');
      //res.render('users/verify', {error:'No such User'});
      res.render('users/login', {error:'No such User'});
    }
  });
}

const viewLogin = (req, res) => {
  // if (!(typeof req.session.user === 'undefined') && !req.session.user.active) {
  //   //user is registered but is not verified
  //   res.render('users/verify');
  // } else if(!(typeof req.session.user === 'undefined') && req.session.user.active) {
  //   //user is registered but is verified
  //   res.redirect('/users');
  // } else {
  //   //user has not registered yet
  //   res.render('users/login');
  // }
  if (!(typeof req.session.user === 'undefined') && !req.session.user.active) {
    //user is registered/loggedIn but is not verified
    res.render('users/verify');
  } else if(!(typeof req.session.user === 'undefined') && req.session.user.active ) {
    //user is registered/loggedIn and is verified
    res.redirect('/users');
  } else {
    //user has to login
    res.render('users/login');
  }
}

//renders loggedIn/userIndex if number and password are correct else shows error.
const login = (req, res) => {
  const phone = req.body.contact;
  const password = req.body.password;

  User.findOne({phone: phone}, (err, doc) => {
    if (err) {
      throw err;
    }
    if (doc) {
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
          console.log('Phone Number or password incorrect');
          res.render('users/login', {error:'Phone Number or password incorrect'});
        }
      } else {
        console.log('Account activated!');
        res.redirect('/users');
      }
      
    } else {
      console.log('no such user');
      res.render('users/login', {error:'No such user'});
    }
  });
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
