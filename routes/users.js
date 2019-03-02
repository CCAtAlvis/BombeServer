const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

/* GET users listing. */
router.get('/', userController.index);

router.post('/login', userController.login);
router.get('/login', userController.viewLogin);

router.post('/register', userController.register);
router.get('/register', userController.viewRegister);

router.post('/verify', userController.verify);
router.get('/verify', userController.viewVerify);

router.get('/logout', userController.logout);

module.exports = router;
