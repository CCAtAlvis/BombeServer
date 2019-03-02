const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staffController');

/* GET users listing. */
router.get('/', staffController.index);

router.get('/register', staffController.viewRegisterStaff);

router.post('/createPatient', staffController.createPatient);

module.exports = router;
