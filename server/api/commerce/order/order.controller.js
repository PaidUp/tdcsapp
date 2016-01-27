'use strict';

var paymentService = require('../../payment/payment.service');
var userService = require('../../user/user.service');
var loanService = require('../../loan/loan.service');
var logger = require('../../../config/logger');
var userLoanService = require('../../loan/application/user/user.service');
var commerceService = require('../commerce.service');
var async = require('async');
//var mix = require('../../../config/mixpanel');

exports.listOrders = function (req, res) {
  var user = req.user;
  commerceService.getUserOrders(user, function (err, orders) {
    if (err) {
      return handleError(res, err);
    }
    async.eachSeries(orders, function (order, callback) {
      if (err) {
        callback(err);
      }
      userService.find({_id: order.athleteId}, function (err, athlete) {
        if (err) {
          callback(err);
        }
        order.athlete = athlete[0];
        callback();
      });
    }, function (err) {
      if (err) { return handleError(res, err); }
      //mix.panel.track("orderList", mix.mergeDataMixpanel(orders, req.user._id));
      return res.status(200).json(orders);
    });
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
