const User = require('../models/User');
const Patient = require('../models/Patient');

const addRefCode = (req, res) => {
  const refCode = req.body.refCode;
  const userId = req.session.user._id;
  const name = req.session.user.name;
  const contact = req.session.user.contact;

  Patient.findOne({ refCode: refCode }, (err, doc) => {
    if (err) {
      throw err;
    }

    if (doc) {
      console.log(doc);
      // add this user to
      let flag = true;
      for (let i = 0; i < doc.users.length; i++) {
        const element = doc.users[i];

        if (element.contact.toString() === contact.toString()) {
          flag = false;
          break;
        }
      }

      if (flag) {
        console.log('adding user to users');
        const update = {
          users: {
            userContact: contact,
            name: name,
            permission: false
          }
        }

        Patient.findByIdAndUpdate({ _id: doc._id }, update, { upsert: true }, (err, doc) => {
          if (err) {
            throw err;
          }

          console.log(doc);
          res.send('you will be able to connect to the patient soon');
        });
      }

    } else {
      res.send('ref code entered is wrong!');
    }
  });
}

module.exports = {
  addRefCode,
}
