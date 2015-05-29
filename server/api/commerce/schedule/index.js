'use strict';

var express = require('express');
var authService = require('../../auth/auth.service');
var controller = require('./schedule.controller');

var router = express.Router();

router.get('/generate/product/:productId' , controller.getSchedule);

module.exports = router;
