'use strict';

var config = require('../../config/environment');
var fs = require("fs");
var async = require('async');
var paymentCronService = require('../payment/payment.cron.service');
var logger = require('../../config/logger');

var jobs =
  [
    // Reminder email before Payments
    function(callback) {
      logger.log('info','paymentCronService.reminderPayments');
      paymentCronService.sendEmailReminderParents(function (err, data) {
        if (err) callback(err);
        callback(null, true);
      });
    },
    // Collect One Time Payments
    function(callback) {
      logger.log('info','paymentCronService.collectCreditCard');
      paymentCronService.collectCreditCard(function (err, data) {
        if (err) callback(err);
        callback(null, data);
      });
    }
  ];

function canStart() {
  if (fs.existsSync(config.cronjob.pidFile)) {
    return false;
  }
  return true;
}

function start() {
  fs.open(config.cronjob.pidFile, "wx", function (err, fd) {
    fs.close(fd, function (err) {
    });
  });
}

function end() {
  try {
    fs.unlinkSync(config.cronjob.pidFile);
  }
  catch (e) {
  }

}

exports.run = function(cb) {
  if(canStart()) {
    logger.log('info', Date() + ' running cron...');
    start();

    async.series(
      jobs,
      function (err, results) {
        end();
        return cb(null,results);
      });
  }else{
    return cb({name:'cronjob.pid is created'});
  }
}

