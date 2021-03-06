'use strict'

var _ = require('lodash')
var applicationService = require('./application.service')
var logger = require('../../config/logger')
var cronjobService = require('./cronjob.service')
var pmx = require('pmx');
// var mix = require('../../config/mixpanel')

exports.contact = function (req, res) {
  var data = req.body
  // mix.panel.track("contact", req.body)
  applicationService.emailContact(data, function (err, data) {
    if (err) {
      logger.info(err, err)
    }
  })
  res.status(200).json({})
}

exports.config = function (req, res) {
  applicationService.configView(function (err, data) {
    res.status(200).json(data)
  })
}

exports.cron = function (req, res) {
  // mix.panel.track("cron", {})
  cronjobService.run(function (err, data) {
    res.status(200).json(data)
  })
}

exports.cronReminderPayments = function (req, res) {
  cronjobService.runReminderPayments(function (err, data) {
    res.status(200).json(data)
  })
}

exports.cronRetryPayments = function (req, res) {
  cronjobService.runRetryPayments(function (err, data) {
    res.status(200).json(data)
  })
}

exports.cronCompleteOrders = function (req, res) {
  cronjobService.runCompleteOrders(function (err, data) {
    if(err){
      pmx.notify(new Error('cronCompleteOrders Error: ' + JSON.stringify(err)));
    }
    res.status(200).json(data)
  })
}

exports.cronCompleteOrdersV2 = function (req, res) {
  cronjobService.runCompleteOrdersV2(function (err, data) {
    if(err){
      pmx.notify(new Error('cronCompleteOrdersV2 Error: ' + JSON.stringify(err)));
    }
    res.status(200).json(data)
  })
}

exports.cronReminderVerifyBank = function (req, res) {
  cronjobService.runReminderVerifyBank(function (err, data) {
    res.status(200).json(data)
  })
}

exports.cronV2 = function (req, res) {
  cronjobService.runv2(function (err, data) {
    if(err){
      pmx.notify(new Error('cronV2 Error: ' + JSON.stringify(err)));
    }
    res.status(200).json(data)
  })
}

exports.cronV3 = function (req, res) {
  cronjobService.runv3(function (err, data) {
    if (err){
      pmx.notify(new Error('cronV3 Error: ' + JSON.stringify(err)));
      return res.status(500).json(err)
    }
    return res.status(200).json(data)
  })
}

exports.cronCompleteOrdersV3 = function (req, res) {
  cronjobService.runCompleteOrdersV3(function (err, data) {
    if(err){
      pmx.notify(new Error('cronCompleteOrdersV3 Error: ' + JSON.stringify(err)));
    }
    res.status(200).json(data)
  })
}
