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
      // console.log(doc);
      // add this user to
      let flag = true;
      for (let i = 0; i < doc.users.length; i++) {
        const element = doc.users[i];
        console.log(element);

        if (element.userContact === contact) {
          flag = false;
          break;
        }
      }

      if (flag) {
        console.log('adding user to users');
        const update = {
          userContact: contact,
          name: name,
          permission: false
        };

        Patient.findByIdAndUpdate({ _id: doc._id }, {$push: {users: update}}, { upsert: true }, (err, doc) => {
          if (err) {
            throw err;
          }

          // console.log(doc);
          // res.send('you will be able to connect to the patient soon');
          res.redirect('/users/requests');
        });
      } else {
        res.redirect('/users/requests');
      }

    } else {
      res.send('ref code entered is wrong!');
    }
  });
}


const chat = (req, res) => {
  const to = req.body.to;
  const from = req.session.user.contact;

  res.render('users/chat', {
    to: to,
    from: from
  })
}


module.exports = {
  addRefCode,
  chat,
}
