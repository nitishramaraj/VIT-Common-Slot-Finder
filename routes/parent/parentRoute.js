const path = require('path');

const express = require('express');

const parentController = require('./parentController');

const router = express.Router();

router.get('/', parentController.welcomePage);
router.get('/login', parentController.loginPage);

module.exports = router;