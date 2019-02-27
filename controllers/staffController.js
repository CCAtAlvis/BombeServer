const viewRegisterStaff = (req, res) => {
  if (req.session.user) {
    res.redirect('/users');
  } else {
    res.render('staff/staffregister');
  }
}

module.exports = {
  viewRegisterStaff
}
