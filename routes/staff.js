const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staffController');

/* GET users listing. */
router.get('/', staffController.index);

router.get('/login', staffController.viewLogin);
router.post('/login', staffController.login);

router.get('/logout', staffController.logout);

router.get('/register', staffController.viewRegisterStaff);
router.post('/register', staffController.register);

router.post('/createPatient', staffController.createPatient);
router.get('/updatePatient/:id', staffController.viewupdatePatient);
router.post('/updatePatient/:id', staffController.updatPatient);
router.post('/deletePatient/:id', staffController.deletePatient);

// router.get('', )

module.exports = router;
