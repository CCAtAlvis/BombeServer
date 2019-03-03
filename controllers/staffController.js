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
      deleted: false
    };
  
    if (role === 'other-staff') {
      // Patient.find(condidions, (err, docs) => {
      //   if (err) {
      //     throw err;
      //   }

      //   if (docs) {
      //     console.log(docs);
      //     res.render('staff/staff/other', {patients: docs});
      //   } else {
      //     res.render('staff/staff/other');
      //   }
      // });
      res.redirect('/staff/other/clipboard');
    } else {
      if (role === 'doctor') {
        // console.log('todo: doctor');
        // condidions.doctor = req.session.user.contact;

        // Patient.find(condidions, (err, docs) => {
        //   if (err) {
        //     throw err;
        //   }

        //   if (docs) {
        //     console.log(docs);
        //     res.render('staff/doctor/doctor', {patients: docs});
        //   } else {
        //     res.render('staff/doctor/doctor');
        //   }
        // });
        res.redirect('/staff/doctor/clipboard');
      } else if (role === 'nurse') {
        // console.log('todo: nurse');

        // Patient.find(condidions, (err, docs) => {
        //   if (err) {
        //     throw err;
        //   }

        //   if (docs) {
        //     console.log(docs);
        //     res.render('staff/nurse/nurse', {patients: docs});
        //   } else {
        //     res.render('staff/nurse/nurse');
        //   }
        // });
        res.redirect('/staff/nurse/clipboard');
      } else {
        res.redirect('/');
      }
    }
  }
}

const viewRegisterStaff = (req, res) => {
  if (typeof req.session.user === 'undefined') {
    //user is not registered/loggedIn
    res.render('staff/register');
  } else {
    //staff is registered/loggedIn
    res.redirect('/staff');
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
  if (typeof req.session.user === 'undefined') {
    //user is not registered/loggedIn
    res.render('staff/login');
  } else {
    //staff is registered/loggedIn
    res.redirect('/staff');
  }
}

//renders loggedIn/userIndex if number and password are correct else shows error.
const login = (req, res) => {
  let contact = req.body.contact;
  const password = req.body.password;
  // console.log(email, password);

  User.findOne({ contact: contact }, (err, doc) => {
    if (err) {
      throw err;
    }

    if (doc) {
      // console.log(doc);
      if (doc.password === password) {
        req.session.user = doc;
        req.session.save((err) => {
          if (err) {
            throw err;
          }
          res.redirect('/staff');
        });

      } else {
        console.log('Contact Number or password incorrect');
        res.render('staff/login', { error: 'Contact Number or password incorrect' });
      }
    } else {
      console.log('no such staff');
      res.render('staff/login', { error: 'No such staff' });
    }
  });
}

const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
}











const doctorClipboard = (req, res) => { }
const viewDoctorClipboard = (req, res) => {
  const condidions = {
    hospCode: req.session.user.hospCode,
    doctor: req.session.user.contact,
    deleted: false
  };

  Patient.find(condidions, (err, docs) => {
    if (err) {
      throw err;
    }

    if (docs) {
      // console.log(docs);
      res.render('staff/doctor/doctor', { patients: docs });
    } else {
      res.render('staff/doctor/doctor');
    }
  });
}
const doctorPatientDetails = (req, res) => { }
const viewDoctorPatientDetails = (req, res) => {
  const condidions = {
    hospCode: req.session.user.hospCode,
    doctor: req.session.user.contact,
    delete: false
  };

  Patient.find(condidions, (err, docs) => {
    if (err) {
      throw err;
    }

    if (docs) {
      // console.log(docs);
      res.render('staff/doctor/doctor', { patients: docs });
    } else {
      res.render('staff/doctor/doctor');
    }
  });
}


const nurseClipboard = (req, res) => { }
const viewNurseClipboard = (req, res) => {
  let condidions = {
    hospCode: req.session.user.hospCode,
    deleted: false
  };

  Patient.find(condidions, (err, docs) => {
    if (err) {
      throw err;
    }

    if (docs) {
      // console.log(docs);
      res.render('staff/nurse/nurse', { patients: docs });
    } else {
      res.render('staff/nurse/nurse');
    }
  });
}
const nursePatientDetails = (req, res) => { }
const viewNursePatientDetails = (req, res) => {
  let condidions = {
    hospCode: req.session.user.hospCode,
    deleted: false
  };


  Patient.find(condidions, (err, docs) => {
    if (err) {
      throw err;
    }

    if (docs) {
      // console.log(docs);
      res.render('staff/nurse/nurse', { patients: docs });
    } else {
      res.render('staff/nurse/nurse');
    }
  });
}


const otherClipboard = (req, res) => { }
const viewOtherClipboard = (req, res) => {
  let condidions = {
    hospCode: req.session.user.hospCode,
    deleted: false
  };

  Patient.find(condidions, (err, docs) => {
    if (err) {
      throw err;
    }

    if (docs) {
      // console.log(docs);
      res.render('staff/staff/other', { patients: docs });
    } else {
      res.render('staff/staff/other');
    }
  });
}
const otherPatientDetails = (req, res) => { }
const viewOtherPatientDetails = (req, res) => {
  let condidions = {
    hospCode: req.session.user.hospCode,
    deleted: false
  };

  Patient.find(condidions, (err, docs) => {
    if (err) {
      throw err;
    }

    if (docs) {
      // console.log(docs);
      res.render('staff/staff/details', { patients: docs });
    } else {
      res.render('staff/staff/details');
    }
  });
}

const viewCreatePatient = (req, res) => {
  res.render('staff/staff/create');
}

const createPatient = (req, res) => {
  const hospCode = req.session.user.hospCode;
  const code = req.body.refCode;
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

const viewUpdatePatient = (req, res) => {
  const _id = req.body._id;
  patient.findById({ _id: _id }, (err, doc) => {
    if (err) {
      throw err;
    }
    if (doc) {
      res.render('staff/updatePatient', { patient: doc });
      //we need to pass the doc to /staff/updatePatient.
    } else {
      console.log('no such patient');
      res.render('staff/updatePatient', { error: 'No such patient' });
    }
  });
}

const updatePatient = (req, res) => {
  const trustedUser = req.body.trustedUser;
  const doctorAssigned = req.body.doctorAssigned;
  const name = req.body.name;
  const gender = req.body.gender;
  const contact = req.body.contact;
  const email = req.body.email;
  const code = req.body.Code;

  console.log(req.body);
  console.log(req.query);
  res.json(req.body);

  // User.findByIdAndUpdate({},(err, doc) => {

  // });
}

const deletePatient = (req, res) => {
  const _id = req.body._id;
  console.log(_id);
  Patient.findOneAndUpdate({ _id: _id }, {$set: {deleted: true}}, {
    upsert: true,
    new: true,
}, (err, doc) => {
    if (err) {
      throw err;
    }

    console.log(doc);
    res.redirect('back');
  });
  //soft delete the patient with the above reference code
}

const allow = (req, res) => {
  const _id = req.body._id;
  console.log(_id);
  Patient.findOneAndUpdate({ _id: _id }, {$set: {pubStream: true}}, {
    upsert: true,
    new: true,
}, (err, doc) => {
    if (err) {
      throw err;
    }
    console.log(doc);

    res.redirect('back');    
  });
}

const deny = (req, res) => {
  const _id = req.body._id;
  console.log(_id);

  Patient.findOneAndUpdate({ _id: _id }, {$set: {pubStream: false}}, {
    upsert: true,
    new: true,
}, (err, doc) => {
    if (err) {
      throw err;
    }
    console.log(doc);
    res.redirect('back');    
  });
}

module.exports = {
  index,
  register,
  viewRegisterStaff,
  login,
  viewLogin,
  logout,

  doctorClipboard,
  viewDoctorClipboard,
  doctorPatientDetails,
  viewDoctorPatientDetails,


  nurseClipboard,
  viewNurseClipboard,
  nursePatientDetails,
  viewNursePatientDetails,

  otherClipboard,
  viewOtherClipboard,
  otherPatientDetails,
  viewOtherPatientDetails,

  viewCreatePatient,
  createPatient,
  viewUpdatePatient,
  updatePatient,
  deletePatient,

  allow,
  deny,
}
