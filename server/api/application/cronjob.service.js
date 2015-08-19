'use strict';

var config = require('../../config/environment');
var fs = require("fs");
var async = require('async');
var paymentCronService = require('../payment/payment.cron.service');
var commerceService = require('../commerce/commerce.service');
var logger = require('../../config/logger');
var path = require('path');
var moment = require('moment');

var jobs =
  [
    // Collect One Time Payments
    function(callback) {
      logger.log('info','paymentCronService.collectCreditCard');
      paymentCronService.collectCreditCard(function (err, data) {
        if (err) callback(err);
        callback(null, data);
      });
    }
  ];

var jobsReminderPayments =
  [
    // Reminder email before Payments
    function(callback) {
      logger.log('info','paymentCronService.reminderPayments');
      paymentCronService.sendEmailReminderParents(function (err, data) {
        if (err) return callback(err);
        callback(null, true);
      });
    }
  ];

var jobsRetryPayments =
  [
    // Reminder email before Payments
    function(callback) {
      logger.log('info','paymentCronService.retryPayments2');
      paymentCronService.retryPaymentSchedule(function (err, data) {
        logger.log('info','paymentCronService.retryPayments');
        if (err) callback(err);
        callback(null, data);
      });
    }
  ];

var jobsCompleteOrders =
  [
    // Reminder email before Payments
    function(callback) {
      commerceService.getListOrdersComplete(function (err, data) {
        if (err) {
          callback(err);
          logger.error('error', err);
        } else {
          logger.log('info', data);
          callback(null, data);
        }
      })
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

function endName(nameFile) {
  try {
    fs.unlinkSync(config.cronjob.pathPidFile+nameFile);
  }
  catch (e) {
    logger.error(e)
  }
}

function canStartGiveNameFile(nameFile) {
  if (fs.existsSync(config.cronjob.pathPidFile+nameFile)) {
    return false;
  }
  return true;
}

function startGiveName(nameFile) {
  fs.open(config.cronjob.pathPidFile+nameFile, "wx", function (err, fd) {
    fs.close(fd, function (err) {
    });
  });
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

exports.runReminderPayments = function(cb) {
  var name = 'retryPayment'+new moment(new Date()).format("YYYYMMDD");
  if(canStartGiveNameFile(name)) {
    logger.log('info', Date() + ' running cronRetryPayments...');
    startGiveName(name);
    async.series(
      jobsReminderPayments,
      function (err, results) {
        return cb(null,results);
      });
  }else{
    return cb(null,{name:name+'.pid is created'});
  }
}

exports.runRetryPayments = function(cb) {
  var name = 'runRetryPayments' + new moment(new Date()).format("YYYYMMDD");
  if(canStartGiveNameFile(name)) {
    logger.log('info', Date() + ' running runRetryPayments...');
    startGiveName(name);

    async.series(
      jobsRetryPayments,
      function (err, results) {
        endName(name);
        return cb(null,results);
      });
  }else{
    return cb(null,{name:name+'.pid is created'});
  }
}

exports.runCompleteOrders = function(cb) {
  var name = 'runCompleteOrders' + new moment(new Date()).format("YYYYMMDD");
  if(canStartGiveNameFile(name)) {
    logger.log('info', Date() + ' running runCompleteOrders...');
    startGiveName(name);

    async.series(
      jobsCompleteOrders,
      function (err, results) {
        endName(name);
        return cb(null,results);
      });
  } else {
    return cb(null,{name:name+'.pid is created'});
  }
}
