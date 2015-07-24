'use strict';

var express = require('express');
var controller = require('./application.controller');

var router = express.Router();

router.post('/contact', controller.contact);
router.get('/config', controller.config);
router.get('/cron', controller.cron);
router.get('/cron/reminder/payments', controller.cronReminderPayments);

//router.use('/report', require('./report/index'));

module.exports = router;
