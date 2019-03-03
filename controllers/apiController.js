const User = require('../models/User');
const Patient = require('../models/Patient');

const sendJSON = (status, message, data, res) => {
  let msg = {
    status: status,
    message: message,
    data: data
  }

  res.json(msg);
  return false;
}

const login = (req, res) => {
  const contact = req.body.contact;
  const password = req.body.password;

  User.findOne({contact: contact}, (err, doc) => {
    if (err) {
      console.log(err);
      sendJSON('error', 'some error with db', err, res);
    }

    if (doc) {
      if (doc.password === password) {
        sendJSON('success', 'yeeee its success', doc, res);
      } else {
        // console.log('Phone Number or password incorrect');
        sendJSON('error', 'Phone Number or password incorrect', 'Phone Number or password incorrect', res);
      }
    } else {
      // console.log('no such user exist!');
      sendJSON('error', 'no such user exist', 'no such user exist', res);
   }
  });
}

const register = (req, res) => {
  const name = req.body.name;
  const contact = req.body.contact;
  const password = req.body.password;
  const role = 'user';

  const user = new User({
    name: name,
    contact: contact,
    password: password,
    role: role,
    verified: true
  });

  user.save((err, doc) => {
    if (err) {
      console.log(err);
      sendJSON('error', 'some error try again later', 'some error try again later', res);
      // throw err;
    }

    sendJSON('success', 'user registered', doc, res);
  });
}


// /getRelatives
const getRelatives = (req, res) => {
  const contact = req.body.contact;

  Patient.find({
    $or: [{trustedUser: contact},
       {'users.userContact': contact, 'users.permission': true}]
  }, (err, docs) => {
    if (err) {
      console.log(err);
      sendJSON('error', 'some error try again later', 'some error try again later', res);
    }

    sendJSON('success', '...', docs, res);
  });
}

// /getPermissions
const getPermissions = (req, res) => {
  const contact = req.body.contact;
  Patient.find({trustedUser: contact}, (err, docs) => {
    if (err) {
      console.log(err);
      sendJSON('error', 'some error try again later', 'some error try again later', res);
    }

    sendJSON('success', '...', docs, res);
  });
}


// /getPatientsForStaff
const getPatientsForStaff = (req, res) => {
  let condidions = {
    hospCode: req.body.hospCode,
    deleted: false
  };

  Patient.find(condidions, (err, docs) => {
    if (err) {
      console.log(err);
      sendJSON('error', 'some error try again later', 'some error try again later', res);
    }

    sendJSON('success', '...', docs, res);
  });
}

const deletePatient = (req, res) => {
  const _id = req.body._id;
  User.findByIdAndUpdate({ _id: _id }, {deleted: true} , (err, doc) => {
    if (err) {
      console.log(err);
      sendJSON('error', 'some error try again later', 'some error try again later', res);
    }

    sendJSON('success', '...', doc, res);
  });
  //soft delete the patient with the above reference code
}

const allow = (req, res) => {
  const _id = req.body._id;
  User.findByIdAndUpdate({ _id: _id }, {pubStream: true} , (err, doc) => {
    if (err) {
      console.log(err);
      sendJSON('error', 'some error try again later', 'some error try again later', res);
    }

    sendJSON('success', '...', doc, res);
  });
}

const deny = (req, res) => {
  const _id = req.body._id;
  User.findByIdAndUpdate({ _id: _id }, {pubStream: false} , (err, doc) => {
    if (err) {
      console.log(err);
      sendJSON('error', 'some error try again later', 'some error try again later', res);
    }

    sendJSON('success', '...', doc, res);
  });
}


const test = (req, res) => {
  const body = req.body;
  const query = req.query;
  const params = req.params;

  const response = {
    status: 'success',
    message: 'success hua ne! aur kya chahiye',
    data: {
      body: body,
      query: query,
      params: params
    }
  }

  res.json(response);
}

module.exports = {
  login,
  register,
  getPatientsForStaff,
  getPermissions,
  getRelatives,
  deletePatient,
  allow,
  deny,
  test
}
