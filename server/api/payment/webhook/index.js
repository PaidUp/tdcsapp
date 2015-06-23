'use strict';

var express = require('express');
var router = express.Router();
var authService = require('../../auth/auth.service');
var controller = require('./webhook.controller');

router.post('/', controller.webpost);
router.get('/', controller.webget);

module.exports = router;

//router.post('/',authService.isAuthenticated(), controller.webpost);