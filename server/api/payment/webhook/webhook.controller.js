'use strict'

var webhookService = require('./webhook.service');
var camelize = require('camelize');

exports.webpost = function (req, res) {
  webhookService.sendEmail(req.body, '', function(err, data){
    return res.status(200).json({webhook:"POST"});
  });
};

exports.webget = function (req, res) {
  webhookService.sendEmail(req.query, '', function(err, data){
    return res.status(200).json({webhook:"GET"});
  });
};

exports.webgetpaymentcharge = function (req, res) {
  console.log('webgetpaymentcharge req.body temp',req.body)
  console.log('webgetpaymentcharge req.query temp',req.query)
  logger.info('-----')
  logger.info('webgetpaymentcharge req.body',req.body)
  logger.info('-----')
  logger.info('webgetpaymentcharge req.query',req.query)
  logger.info('-----')
  webhookService.sendEmail(req.query, '[Charge]', function(err, data){
    return res.status(200).json({webhook:"webgetpaymentcharge"});
  })
}

exports.webgetpaymentchargeTemp = function (req, res) {
  console.log('webgetpaymentchargeTemp req.body temp',req.body)
  console.log('webgetpaymentchargeTemp req.query temp',req.query)
  logger.info('-----')
  logger.info('webgetpaymentchargeTemp req.body',req.body)
  logger.info('-----')
  logger.info('webgetpaymentchargeTemp req.query',req.query)
  logger.info('-----')
  webhookService.sendEmail(req.body, '[ChargeTemp]', function(err, data){
    return res.status(200).json({webhook:"webgetpaymentchargeTemp"});
  })
}

function handleError(res, err) {
  var httpErrorCode = 500;
  var errors = [];

  if (err.name === "ValidationError") {
    httpErrorCode = 400;
  }

  return res.status(httpErrorCode).json({
    code: err.name,
    message: err.message,
    errors: err.errors
  });
}
