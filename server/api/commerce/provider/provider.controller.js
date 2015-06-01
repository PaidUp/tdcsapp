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
  });
}

exports.providerResponse = function (req, res) {
  /*console.log('headers',req.headers);
  console.log('headers',req.headers.host);
  console.log('ip1',req.connection.remoteAddress);
  console.log('ip2',req.headers["X-Forwarded-For"]);
  console.log('ip3',req.headers["x-forwarded-for"]);
  console.log('ip4',req.client.remoteAddress);*/

  var providerId = req.params.id;
  commerceService.providerResponse(providerId, 'pending', function (err, provider) {
    if (err) {
      return handleError(res, err);
    }
    if (!provider) {
      return res.redirect('/');
    }
    paymentService.createConnectAccount({email:provider.ownerEmail,country:provider.country}, function(err, account){
      if(err){
        //return handleError(res, err);
        return res.json(400);
      }
      paymentService.addBankConnectAccount({accountId:account.id,bankAccount:{country:provider.country,routingNumber:provider.aba,accountNumber:provider.dda}}, function(err, bank){
        if(err){
          //return handleError(res, err);
          return res.json(401);
        }
        var ip = req.headers('x-forwarded-for') || req.connection.remoteAddress;
        paymentService.addToSCustomer({accountId:account.id, ip:ip}, function(err, acceptedToS){
          if(err){
            //return handleError(res, err);
            return res.json(401);
          }
          catalogService.catalogCreate({teamName:provider.teamName}, function(err, teamId){
            if(err){
              //return handleError(res, err);
              return res.json(402);
            }
            //TODO
            commerceService.providerResponseUpdate(providerId, {verify:'done'}, function (err, provider) {
              if(err){
                //return handleError(res, err);
                return res.json(403);
              }
              return res.redirect('/');
            });
          });
        });
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
