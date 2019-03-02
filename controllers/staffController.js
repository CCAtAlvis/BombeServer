const User = require('../models/User');
const Patient = require('../models/Patient');

const index = (req, res) => {
  if (typeof req.session.user === 'undefined') {
    //user is not registered/loggedIn
    res.redirect('/staff/login');
  } else {
    const role = req.session.user.role;
    const hospCode = req.session.user.hospCode;

    let condidions = {
      hospCode: hospCode,
    };

    if (role === 'other-staff') {
      Patient.find(condidions, (err, docs) => {
        if (err) {
          throw err;
        }

        if (docs) {
          console.log(docs);
          res.render('staff/other', {patients: docs});
        } else {
          res.render('staff/other');
        }
      });
    } else {
      if (role === 'doctor') {
        res.send('todo: doctor');
      } else if (role === 'nurse') {
        res.send('todo: nurse');
      } else {
        res.redirect('/', { error: 'Unauth Access!' });
      }
    }
  }
}

const viewRegisterStaff = (req, res) => {
  if (typeof req.session.user !== 'undefined') {
    //staff is registered/loggedIn
    res.redirect('/staff');
  } else if((typeof req.session.user === 'undefined')) {
    //user is not registered/loggedIn
    res.render('staff/staffregister');
  } else {
    //user has to login
    // res.render('users/login');
  }
}

const register = (req, res) => {
  const email = req.body.email;
  const name = req.body.name;
  const contact = req.body.contact;
  const password = req.body.password;
  const hospCode = req.body.hospCode;
  const role = req.body.role;

  const user = new User({
    email: email,
    name: name,
    contact: contact,
    password: password,
    role: role,
    hospCode: hospCode,
    verified: true
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
  }); 
}

const viewLogin = (req, res) => {
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

  User.findOne({ phone: phone }, (err, doc) => {
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

const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
}










const createPatient = (req, res) => {
  const hospCode = req.session.user.hospCode;
  const code = req.body.refID;
  const trustedUser = req.body.trustedUser;
  const doctorAssigned = req.body.doctor;
  const name = req.body.name;
  const gender = req.body.gender;
  const contact = req.body.contact;
  const email = req.body.email;

  //create a patient with the above details and add them to database
  let patient = new Patient({
    refCode: code,
    trustedUser: trustedUser,
    doctor: doctorAssigned,
    name: name,
    contact: contact,
    gender: gender,
    email: email,
    hospCode: hospCode
  });

  patient.save()
    .then(doc => {
      console.log(doc)
      res.redirect('/staff');
    })
    .catch(err => {
      console.error(err)
    })
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

module.exports = {
  index,
  register,
  viewRegisterStaff,
  login,
  viewLogin,
  logout,
  createPatient,
  viewupdatePatient,
  deletePatient,
}
