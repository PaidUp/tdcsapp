'use strict';

var express = require('express');
var authService = require('../../auth/auth.service');
var controller = require('./schedule.controller');

var router = express.Router();

router.post('/generate' , controller.getSchedule);
router.post('/list' , controller.paymentPlanList);
router.get('/info/full/:paymentplanid' , controller.paymentPlanInfoFull);

module.exports = router;
