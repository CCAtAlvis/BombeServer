const User = require('../models/User');
const Patient = require('../models/Patient');
const formidable = require('formidable');

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
          permission: true
        };

        Patient.findByIdAndUpdate({ _id: doc._id }, {$push: {users: update}}, { upsert: true }, (err, doc) => {
          if (err) {
            throw err;
          }

          // console.log(doc);
          // res.send('you will be able to connect to the patient soon');
          res.redirect('/users');
        });
      } else {
        res.redirect('/users');
      }

    } else {
      res.write('<meta http-equiv="refresh" content="2; url=/users/" />');
      res.write('reference code entered is wrong!');
      res.end();
    }
  });
}


const chat = (req, res) => {
  const to = req.params.to;
  const from = req.session.user.contact;

  res.render('users/chat', {
    to: to,
    from: from
  })
}


const post = (req, res) => {
  var form = new formidable.IncomingForm();
  form.parse(req);

  form.on('fileBegin', function (name, file){
      file.path = __dirname + '/uploads/' + file.name;
  });

  form.on('file', function (name, file) {
      console.log('Uploaded ' + file.name);
  });

  res.json({status: 'success', message: 'file uploaded succesfully'});
}


module.exports = {
  addRefCode,
  chat,
  post,
}
