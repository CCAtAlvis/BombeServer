const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');

router.post('/login', apiController.login);
router.post('/register', apiController.register);

router.post('/getPatientsForStaff', apiController.getPatientsForStaff);
router.post('/getPermissions', apiController.getPermissions);
router.post('/getRelatives', apiController.getRelatives);

router.post('/test', apiController.test);

module.exports = router;
