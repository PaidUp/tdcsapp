'use strict';

var express = require('express');
var controller = require('./dues.controller');
var authService = require('../../auth/auth.service');

var router = express.Router();

router.post('/calculate' , authService.isAuthenticated(), controller.calculateDues);

module.exports = router;
