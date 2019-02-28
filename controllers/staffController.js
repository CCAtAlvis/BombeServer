const User = require('../models/User');

const index = (req, res) => {
  res.render('staff/index');
  // if (req.session.user) {
  //   res.render('staff/index');
  // } else {
  //   res.redirect('/users/login');
  // }
}

const viewRegisterStaff = (req, res) => {
  if (req.session.user) {
    res.redirect('/users');
  } else {
    res.render('staff/staffregister');
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
}

module.exports = {
  index,
  viewRegisterStaff,
  createPatient
}
