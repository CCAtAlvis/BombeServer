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
<<<<<<< HEAD
router.get('/updatePatient/:id', staffController.viewupdatePatient);
router.post('/updatePatient', staffController.updatePatient);
router.post('/deletePatient/:id', staffController.deletePatient);
=======
router.get('/updatePatient', staffController.viewupdatePatient);
router.post('/updatePatient', staffController.updatePatient);
router.post('/deletePatient', staffController.deletePatient);
>>>>>>> 0d6ef6ca765de0e3ef54c288998e41ee04f1601f

router.get('/doctor/clipboard', staffController.viewDoctorClipboard );
router.post('/doctor/clipboard', staffController.doctorClipboard );
router.get('/doctor/details', staffController.viewDoctorPatientDetails );
router.post('/doctor/details', staffController.doctorPatientDetails );

router.get('/nurse/clipboard', staffController.viewNurseClipboard );
router.post('/nurse/clipboard', staffController.nurseClipboard );
router.get('/nurse/details', staffController.viewNursePatientDetails );
router.post('/nurse/details', staffController.nursePatientDetails );

router.get('/other/clipboard', staffController.viewOtherClipboard );
router.post('/other/clipboard', staffController.otherClipboard );
router.get('/other/details', staffController.viewOtherPatientDetails );
router.post('/other/details', staffController.otherPatientDetails );

module.exports = router;
