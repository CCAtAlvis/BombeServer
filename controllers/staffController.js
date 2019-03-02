const User = require('../models/User');
const Patient = require('../models/Patient');
const index = (req, res) => {
  let role = req.session.user.role;
  // if (role === 'doctor') {
    
  // } else if (role === 'nurse') {

  // } else if (role === 'other-staff') {

  // }
  if (!(typeof req.session.user === 'undefined')) {
    //staff is registered/loggedIn
    res.render('staff/index');
  } else if((typeof req.session.user === 'undefined')) {
    //user is not registered/loggedIn
    res.redirect('/staff/login');
  } else {
    //user has to login
    // res.render('users/login');
  }
}

const viewRegisterStaff = (req, res) => {
  // if (req.session.user) {
  //   res.redirect('/staff');
  // } else {
  //   res.render('staff/staffregister');
  // }
  if (!(typeof req.session.user === 'undefined')) {
    //staff is registered/loggedIn
    res.render('staff/index');
  } else if((typeof req.session.user === 'undefined')) {
    //user is not registered/loggedIn
    res.redirect('/staff/register');
  } else {
    //user has to login
    // res.render('users/login');
  }
}

const createPatient = (req, res) => {
  const code = req.body.Code;
  const trustedUser = req.body.trustedUser;
  const doctorAssigned = req.body.doctorAssigned;
  const name = req.body.name;
  const gender = req.body.gender;
  const contact = req.body.contact;
  const email = req.body.email;
  //create a patient with the above details and add them to database
  let patient = new Patient({
    refCode: code,
    trustedUser: {userContact: trustedUser},
    doctor: doctorAssigned,
    name: name,
    gender: gender,
    contact: contact,
    email: email
  })
  user.save()
     .then(doc => {
       console.log(doc)
     })
     .catch(err => {
       console.error(err)
     })
}

const viewLogin = (req, res) => {
  // if(req.session.user) {
  //   res.redirect('/staff');
  // } else {
  //   res.render('staff/login');
  // }
  if (!(typeof req.session.user === 'undefined')) {
    //staff is registered/loggedIn
    res.render('staff/index');
  } else if((typeof req.session.user === 'undefined')) {
    //user is not registered/loggedIn
    res.redirect('/staff/login');
  } else {
    //user has to login
    // res.render('users/login');
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
      if(doc.password === password) {
        req.session.user = doc;
        req.session.save((err) => {
          if (err) {
            throw err;
          }
          res.redirect('/staff');
        });

      } else {
        console.log('Phone Number or password incorrect');
        res.render('staff/login', {error:'Phone Number or password incorrect'});
      }
    } else {
      console.log('no such staff');
      res.render('staff/login', {error:'No such staff'});
    }
  });
}

const viewupdatePatient = (req, res) => {
  const code = req.body.Code;
  User.findOne({code: code}, (err, doc) => {
    if (err) {
      throw err;
    }
    if (doc) {
      res.render('staff/updatePatient',{patient:doc});
      //we need to pass the doc to /staff/updatePatient.
    } else {
      console.log('no such patient');
      res.render('staff/updatePatient', {error:'No such patient'});
    }
  });
}

const updatePatient = (req,res) => {

  const trustedUser = req.body.trustedUser;
  const doctorAssigned = req.body.doctorAssigned;
  const name = req.body.name;
  const gender = req.body.gender;
  const contact = req.body.contact;
  const email = req.body.email;
  const code = req.body.Code;
  User.findByIdAndUpdate({},(err, doc) => {

  });
}

const deletePatient = (req, res) => {
  const code = req.body.Code;
  User.findOne({code: code}, (err, doc) => {
    if (err) {
      throw err;
    }
    if (doc) {
      // console.log(doc);
      req.session.user = doc;
    } else {
      console.log('no such patient');
      res.render('staff/updatPatient', {error:'No such patient'});
    }
  });
  //soft delete the patient with the above reference code
}

const register = (req, res) => {
  const name = req.body.name;
  const contact = req.body.contact;
  const password = req.body.password;
  const role = req.body.role;
  const user = new User({
    // email: email,
    name: name,
    contact: contact,
    password: password,
    role: role
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
      res.redirect('/staff');
    });
  })
}

module.exports = {
  index,
  viewRegisterStaff,
  createPatient,
  login,
  viewLogin,
  viewupdatePatient,
  deletePatient,
  register
}
