'use strict';

var _ = require('lodash');
var applicationService = require('./application.service');
var logger = require('../../config/logger');
var cronjobService = require('./cronjob.service');
var mix = require('../../config/mixpanel');

exports.contact = function(req, res) {
	var data = req.body;
  mix.panel.track("contact", req.body);
	applicationService.emailContact(data, function(err, data) {
		if(err){
			logger.info(err, err);
		}
    });
	res.status(200).json({});
}

exports.config = function(req, res) {
	applicationService.configView(function(err, data) {
      res.status(200).json(data);
  });
}

exports.cron = function(req, res) {
    mix.panel.track("cron", {});
    cronjobService.run(function(err, data){
        res.status(200).json(data);
    });
}

exports.cronReminderPayments = function(req, res) {
    cronjobService.runReminderPayments(function(err, data){
      res.status(200).json(data);
    });
}

exports.cronRetrayPayments = function(req, res) {
  cronjobService.runRetryPayments(function(err, data){
    res.status(200).json(data);
  });
}

exports.cronCompleteOrders = function(req, res) {
  cronjobService.runCompleteOrders(function(err, data){
    res.status(200).json(data);
  });
}
