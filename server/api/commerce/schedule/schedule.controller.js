'use strict';

var logger = require('../../../config/logger');
var commerceService = require('../commerce.service');
var config = require('../../../config/environment');
var mix = require('../../../config/mixpanel');

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

function handleError(res, err) {
  var httpErrorCode = 500;
  var errors = [];

  if(err.name === "ValidationError") {
    httpErrorCode = 400;
  }
  logger.log('error', err);

  return res.status(httpErrorCode).json({code : err.name, message : err.message, errors : err.errors});
}
