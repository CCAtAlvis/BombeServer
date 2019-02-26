const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/login', userController.login);
router.get('/login', userController.viewLogin);

router.get('/register', userController.register);
router.post('/register', userController.viewRegister);

module.exports = router;
