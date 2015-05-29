'use strict';

var logger = require('../../../config/logger');
var commerceService = require('../commerce.service');
var config = require('../../../config/environment');
var mix = require('../../../config/mixpanel');

exports.getSchedule = function (req, res) {
  commerceService.getSchedule(req.params.productId, function (err, data) {
    if (err) {
      return handleError(res, err);
    }

    return res.json(200, data);
  });
}

function handleError(res, err) {
  var httpErrorCode = 500;
  var errors = [];

  if(err.name === "ValidationError") {
    httpErrorCode = 400;
  }
  logger.log('error', err);

  return res.json(httpErrorCode, {code : err.name, message : err.message, errors : err.errors});
}
