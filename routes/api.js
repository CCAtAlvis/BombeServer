const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');

router.post('/login', apiController.login);
router.post('/test', apiController.test);

module.exports = router;
