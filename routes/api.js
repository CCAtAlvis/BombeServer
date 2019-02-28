const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');

router.post('/login', apiController.login);

module.exports = router;
