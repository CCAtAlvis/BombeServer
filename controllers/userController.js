const User = require('../models/User');

const viewRegister = (req, res) => {
  if (!req.session.user.active) {
    res.render('users/verify');
  } else if(req.session.user.active) {
    res.redirect('/users');
  } else {
    res.render('users/register');
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
      res.redirect('/verify');
    });
  })
}

//if no user logged in show login page else userIndex page
const index = (req, res) => {
  console.log('show the index here');
  if(!req.session.user) {
    res.redirect('/users/login');
  } else {
    // res.send('hello user!');
    res.render('users/index');
  }
}



//OTP verification 
const viewVerify = (req, res) => {
  if (req.session.user.active) {
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
        res.render('users/verify', {error:'Invalid OTP'});
      }
    } else {
      console.log('no such user');
      res.render('users/verify', {error:'No such User'});
    }
  });
}


const viewLogin = (req, res) => {
  if (!req.session.user.active) {
    res.render('users/verify');
  } else if(req.session.user.active) {
    res.redirect('/users');
  } else {
    res.render('users/login');
  }
}

//renders loggedIn/userIndex if number and password are correct else shows error.
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
