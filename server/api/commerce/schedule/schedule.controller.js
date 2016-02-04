'use strict';

var logger = require('../../../config/logger');
var commerceService = require('../commerce.service');
var config = require('../../../config/environment');
//var mix = require('../../../config/mixpanel');
let paymentPlan = require('./schedule.service')();

exports.getSchedule = function (req, res) {
  commerceService.getSchedule(req.body.productId,
    req.body.price,
    req.body.isInFullPay,
    req.body.discount, function (err, data) {
    if (err) {
      return handleError(res, err);
    }

    return res.status(200).json(data);
  });
}

exports.paymentPlanList = function (req, res) {
  let filter = req.body.scheduleFilter
  paymentPlan.paymentPlanList(filter, function(err, paymentList) {
    if (err) {
      return handleError(res, err)
    }
    res.status(200).json({'paymentList':paymentList})
  });
}

exports.paymentPlanInfoFull = function (req, res) {
  console.log('req.params', req.params)
  let filter = req.params.paymentplanid
  paymentPlan.paymentPlanInfoFull(filter, function(err, paymentList) {
    if (err) {
      return handleError(res, err)
    }
    res.status(200).json({'paymentList':paymentList})
  });
}

function handleError(res, err) {
  console.log('err',err)
  console.log('err.name',err.name)
  var httpErrorCode = 500;
  var errors = [];

  if(err.name === "ValidationError" || err.name === "Magento Error") {
    httpErrorCode = 400;
  }
  logger.log('error', err);

  return res.status(httpErrorCode).json({code : err.name, message : err.message, errors : err.errors});
}
