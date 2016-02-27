'use strict';

var express = require('express');
var authService = require('../../auth/auth.service');
var controller = require('./dues.controller');
var authService = require('../../auth/auth.service');

var router = express.Router();

router.post('/generate' , authService.isAuthenticated(), controller.generateDues);

module.exports = router;
