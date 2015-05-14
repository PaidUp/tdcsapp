'use strict';

var express = require('express');
var authService = require('../../auth/auth.service');
var controller = require('./provider.controller');

var router = express.Router();

router.post('/request', authService.isAuthenticated(), controller.providerRequest);

module.exports = router;
