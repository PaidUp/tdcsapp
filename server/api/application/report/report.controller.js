'use strict';

var _ = require('lodash');
var reportService = require('./report.service');

exports.parentsBuy = function(req, res) {
	reportService.parentsBuy(function(err, data) {
        res.json(200,data);
    });
	
}