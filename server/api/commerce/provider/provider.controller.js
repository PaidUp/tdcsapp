'use strict';

var logger = require('../../../config/logger');
var commerceService = require('../commerce.service');
var config = require('../../../config/environment');
var mix = require('../../../config/mixpanel');

exports.providerRequest = function (req, res) {
  var userId = req.user._id;
  commerceService.providerRequest(userId, req.body.providerInfo, function (err, provider) {
    if (err) {
      return handleError(res, err);
    }
    //mix.panel.track("providerRequest", mix.mergeDataMixpanel(provider, req.user._id));
    return res.json(200);
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
