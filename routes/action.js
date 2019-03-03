const express = require('express');
const router = express.Router();
const actionController = require('../controllers/actionController');
const patientController = require('../controllers/actionController');

router.post('/addRefCode', actionController.addRefCode);

router.post('/post', actionController.post);


module.exports = router;
