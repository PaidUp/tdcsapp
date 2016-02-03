'use strict';

var express = require('express');
var authService = require('../../auth/auth.service');
var controller = require('./schedule.controller');

var router = express.Router();

router.post('/generate' , controller.getSchedule);
router.post('/list' , controller.paymentPlanList);
router.post('/information/update' , controller.scheduleInformationUpdate);
router.post('/information/create' , controller.scheduleInformationCreate);
router.get('/info/full/:orderId' , controller.paymentPlanInfoFullByOrderId);

module.exports = router;
