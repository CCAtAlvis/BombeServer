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
router.get('/updatePatient', staffController.viewupdatePatient);
router.post('/updatePatient', staffController.updatePatient);
router.post('/deletePatient', staffController.deletePatient);

router.get('/doctor/clipboard', staffController );
router.post('/doctor/clipboard', staffController );
router.get('/doctor/details', staffController );
router.post('/doctor/details', staffController );

router.get('/nurse/clipboard', staffController );
router.post('/nurse/clipboard', staffController );
router.get('/nurse/details', staffController );
router.post('/nurse/details', staffController );

router.get('/other/clipboard', staffController );
router.post('/other/clipboard', staffController );
router.get('/other/details', staffController );
router.post('/other/details', staffController );

module.exports = router;
