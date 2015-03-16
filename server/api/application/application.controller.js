'use strict';

var _ = require('lodash');
var applicationService = require('./application.service');
var logger = require('../../config/logger');
//var cronjobService = require('./cronjob.service');

exports.contact = function(req, res) {
	console
	var data = req.body;
	applicationService.emailContact(data, function(err, data) {
		if(err){
			logger.info(err, err);
		}
    });
	res.json(200,{});
}

exports.config = function(req, res) {
	applicationService.configView(function(err, data) {
      res.json(200,data);
  });
}
/**
exports.cron = function(req, res) {
  cronjobService.run(function(err, data){
    res.json(200, data);
  });
}
*/
