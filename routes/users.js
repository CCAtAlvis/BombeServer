const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const actionController = require('../controllers/actionController');

/* GET users listing. */
router.get('/', userController.index);

router.post('/login', userController.login);
router.get('/login', userController.viewLogin);

router.post('/register', userController.register);
router.get('/register', userController.viewRegister);

router.post('/verify', userController.verify);
router.get('/verify', userController.viewVerify);

router.get('/logout', userController.logout);

router.get('/connect', userController.viewConnect);
router.post('/connect', userController.connect);

router.get('/requests', userController.viewRequests);
router.post('/requests', userController.requests);

router.post('/permissions', userController.permissions);
router.get('/permissions', userController.viewPermissions);

router.post('/chat', actionController.chat);

module.exports = router;
