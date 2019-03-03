const express = require('express');
const router = express.Router();
const actionController = require('../controllers/actionController');
const patientController = require('../controllers/actionController');

router.post('/addRefCode', actionController.addRefCode);



module.exports = router;
