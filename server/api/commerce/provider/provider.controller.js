'use strict';

var logger = require('../../../config/logger');
var commerceService = require('../commerce.service');
var catalogService = require('../catalog/catalog.service');
var paymentService = require('../../payment/payment.service');
var commerceEmailService = require('../commerce.email.service');
var config = require('../../../config/environment');
var mix = require('../../../config/mixpanel');
var userService = require('../../user/user.service');

exports.providerRequest = function (req, res) {
  var userId = req.user._id;
  commerceService.providerRequest(userId, req.body.providerInfo, function (err, provider) {
    if (err) {
      return handleError(res, err);
    }
    var userUpd = {_id:userId,'meta.providerStatus':'pending'};
    userService.save(userUpd, function(err, data){
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
  });
}

exports.providerResponse = function (req, res) {
  var providerId = req.params.id;
  commerceService.providerResponse(providerId, 'pending', function (err, provider) {
    if (err) {
      return handleError(res, err);
    }
    if (!provider) {
      return res.json(200);
    }
    //TODO CS-469
    var stripeInfo = {
      email:provider.ownerEmail,
      country:provider.country
    };
    paymentService.createConnectAccount(stripeInfo, function(err, account){
      if(err){
        //return handleError(res, err);
        return res.json(400);
      }
      paymentService.addBankConnectAccount({accountId:account.id,bankAccount:{country:provider.country,routingNumber:provider.aba,accountNumber:provider.dda}}, function(err, bank){
        if(err){
          //return handleError(res, err);
          return res.json(401);
        }
        var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.client.remoteAddress;
        var legalEntity={
          accountId:account.id,
          firstName:provider.ownerName,
          lastName:provider.ownerName,
          day:provider.ownerDOB.getDay() + 1,
          month:provider.ownerDOB.getMonth() + 1,
          year:provider.ownerDOB.getFullYear(),
          type:'company'
        };
        paymentService.addToSCustomer({accountId:account.id, ip:ip}, function(err, acceptedToS){
          if(err){
            //return handleError(res, err);
            return res.json(401);
          }
          paymentService.addLegalCustomer(legalEntity, function(err, acceptedLegal){
            if(err){
              //return handleError(res, err);
              return res.json(401);
            }
            var productTeam = {
              type:'grouped',//
              set:'9',// should be 9 for Team attibute set.
              sku:provider.ownerId,
              data: {
                name:provider.teamName,
                websites:['1'],
                short_description:provider.businessName,
                description:'account.id: ' + account.id,
                status:'1',
                price:'1',
                tax_class_id:'0',
                url_key:'product-url-key',
                url_path:'url_path',
                visibility:'4',
                categories:['4'],
                categoryIds:['4']
              }
            }
            catalogService.catalogCreate(productTeam, function(err, teamId){
              if(err){
                //return handleError(res, err);
                return res.json(402);
              }
              //TODO save account.id - and teamId in mongodb - provider in data value.
              commerceService.providerResponseUpdate(providerId, {verify:'done'}, function (err, providerData) {
                if(err){
                  //return handleError(res, err);
                  return res.json(403);
                }
                var userUpd = {_id:provider.ownerId,
                  'meta.providerStatus':'done',
                  product_related : teamId};
                userService.save(userUpd, function(err, data){
                  if (err) {
                    return handleError(res, err);
                  }
                  return res.json(200);
                });
              });
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
