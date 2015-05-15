'use strict';

var logger = require('../../../config/logger');
var commerceService = require('../commerce.service');
var catalogService = require('../catalog/catalog.service');
var paymentService = require('../../payment/payment.service');
var commerceEmailService = require('../commerce.email.service');
var config = require('../../../config/environment');
var mix = require('../../../config/mixpanel');

exports.providerRequest = function (req, res) {
  var userId = req.user._id;
  commerceService.providerRequest(userId, req.body.providerInfo, function (err, provider) {
    if (err) {
      return handleError(res, err);
    }
    commerceEmailService.sendContactEmail(provider, function(err, send){
      if(err){
        logger.info(err);
      }
    });
    return res.json(200);
    //TODO: send email CS admin with all information provider.
    //mix.panel.track("providerRequest", mix.mergeDataMixpanel(provider, req.user._id));
  });
}

exports.providerResponse = function (req, res) {
  var providerId = req.params.id;
  commerceService.providerResponse(providerId, function (err, provider) {
    if (err) {
      return handleError(res, err);
    }
    paymentService.createConnectAccount('providerDataOwner', function(err, account){
      if(err){
        //return handleError(res, err);
        return res.json(400);
      }
      catalogService.createProduct('providerDataTeam', function(err, team){
        if(err){
          //return handleError(res, err);
          return res.json(401);
        }
        return res.json(200);
      });
    });
    //return res.redirect('/');
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
