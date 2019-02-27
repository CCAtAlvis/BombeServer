const User = require('../models/User');

const index = (req, res) => {
  if (req.session.user) {
    res.render('staff/index');
  } else {
    res.redirect('/users/login');
  }
}

const viewRegisterStaff = (req, res) => {
  if (req.session.user) {
    res.redirect('/users');
  } else {
    res.render('staff/staffregister');
  }
}

module.exports = {
  index,
  viewRegisterStaff
}
