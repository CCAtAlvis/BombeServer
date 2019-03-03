const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');

router.get('/', patientController.index);
router.post('/', patientController.start);
router.get('/start/:id', patientController.viewStart);
router.get('/live/:id', patientController.live);
router.get('/chat/:id', patientController.chat);

module.exports = router;
