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

router.get('/doctor/clipboard', staffController.viewDoctorClipboard);
router.post('/doctor/clipboard', staffController.doctorClipboard);
router.get('/doctor/details', staffController.viewDoctorPatientDetails);
router.post('/doctor/details', staffController.doctorPatientDetails);

router.get('/nurse/clipboard', staffController.viewNurseClipboard);
router.post('/nurse/clipboard', staffController.nurseClipboard);
router.get('/nurse/details', staffController.viewNursePatientDetails);
router.post('/nurse/details', staffController.nursePatientDetails);

router.get('/other/clipboard', staffController.viewOtherClipboard);
router.post('/other/clipboard', staffController.otherClipboard);
router.get('/other/details', staffController.viewOtherPatientDetails);
router.post('/other/details', staffController.otherPatientDetails);

router.get('/other/create', staffController.viewCreatePatient);
router.post('/other/create', staffController.createPatient);
router.get('/other/update', staffController.viewUpdatePatient);
router.post('/other/update', staffController.updatePatient);
router.post('/other/delete', staffController.deletePatient);

module.exports = router;
