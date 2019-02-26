const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

/* GET users listing. */
router.get('/', function (req, res, next) {
  console.log(req.session.user);
  res.send('respond with a resource');
});

router.post('/login', userController.login);
router.get('/login', userController.viewLogin);

router.post('/register', userController.register);
router.get('/register', userController.viewRegister);

router.get('/logout', userController.logout);

module.exports = router;
