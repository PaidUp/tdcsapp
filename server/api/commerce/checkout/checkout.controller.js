'use strict';

var _ = require('lodash');
var checkoutService = require('./checkout.service');
var cartService = require('../cart/cart.service')
var paymentService = require('../../payment/payment.service');
var paymentEmailService = require('../../payment/payment.email.service');
var userService = require('../../user/user.service');
var loanService = require('../../loan/loan.service');
var cartService = require('../cart/cart.service');
var logger = require('../../../config/logger');

var contractEmail = require('../../loan/loan.contract.email.service');
var loanApplicationService = require('../../loan/application/loanApplication.service');
var userLoanService = require('../../loan/application/user/user.service');

exports.place = function(req, res) {
  if(!req.body || !req.body.addresses || !req.body.paymentMethod || !req.body.payment) {
    return res.json(400, {
      "code": "ValidationError",
      "message": "Addresses, paymentMethod and payment are required params."
    });
  }
  if(! req.body.cardId && req.body.payment == "onetime") {
    return res.json(400, {
      "code": "ValidationError",
      "message": "CardId is required with onetime payment."
    });
  }
  if(! (['creditcard','directdebit'].indexOf(req.body.paymentMethod) > -1)) {
    return res.json(400, {
      "code": "ValidationError",
      "message": "Payment method invalid."
    });
  }
  if(! (['onetime','loan'].indexOf(req.body.payment) > -1)) {
    return res.json(400, {
      "code": "ValidationError",
      "message": "Payment type invalid."
    });
  }

  // Require params
  var orderData = {
    userId: req.user._id,
    payment: req.body.payment,
    paymentMethod: req.body.paymentMethod,
    athleteId: req.body.userId,
    cardId: req.body.cardId
  }
  // Process order
  if (req.body.payment == "loan") {
    loanService.findOne({_id: req.body.loanId}, function (err,loan){
      cartService.addLoanInterest(req.body.cartId, loan.interestSum, function (err, data) {
        if (err) return handleError(res, err);
        placeOrder(req.user, req.body.cartId, req.body.addresses, orderData, function (err, magentoOrderId){
          if (err) return handleError(res, err);
          loanService.findOne({_id: req.body.loanId}, function (err, loan) {
            loan.orderId = magentoOrderId;
            loanService.save(loan, function (err, dataLoan){
              var filter = {_id:loan.applicationId};
              loanApplicationService.findOne(filter._id, function (err, dataApploan) {
                var filterUserLoan = {_id:dataApploan.meta[0].userId};
                userLoanService.findOne(filterUserLoan, function (err, dataUserLoan){
                  contractEmail.sendContractEmail(dataUserLoan, dataLoan, function (err, dataEmail) {
                    if(err){
                      logger.info(err, err);
                    }
                  });
                });
              });

              return res.json(200, magentoOrderId);
            });
          });

        });
      });
    });
  }
  else if (req.body.payment == "onetime") {
    placeOrder(req.user, req.body.cartId, req.body.addresses, orderData, function(err, magentoOrderId){
      if (err) return handleError(res, err);
      return res.json(200, magentoOrderId);
    });
  }
}

function placeOrder(user, cartId, addresses, orderData, cb) {
  cartService.cartView(cartId.cartId, function (err, shoppingCart) {
    if (err) return cb(err);
    cartService.prepareMerchantProducts(shoppingCart, function (err, merchantProducts) {
      if (err) return cb(err);
      orderData.products = merchantProducts;
      checkoutService.placeOrder(user, cartId, addresses, orderData, function (err, magentoOrderId) {
        if (err) return cb(err);
        paymentService.prepareUser(user, function (err, user) {
          if(err) logger.log('error',err);
          var team = {
            name: shoppingCart.items[1].name,
            sku: shoppingCart.items[1].sku
          };
          userService.find({_id:orderData.athleteId}, function(err, child){
            child[0].teams.push(team);
            var acountNumber;
            var action;
            if (orderData.paymentMethod==='directdebit') {
              action = 'fetchBank';
            } else {
              action = 'fetchCard';
            };
            paymentService[action](orderData.cardId, function(err, account){
              var accountNumber;
              if (orderData.paymentMethod==='directdebit') {
                accountNumber = '';
              }else{
                accountNumber = account.cards[0].number;
              }
              var amount = parseFloat(shoppingCart.grandTotal).toFixed(2);
              userService.save(child[0], function(err, userAthlete) {
                if(err) logger.log('error',err);
                paymentEmailService.sendNewOrderEmail(magentoOrderId, user.email, orderData.paymentMethod, accountNumber, amount, function (err, data) {
                  if(err) logger.log('error',err);
                });
                return cb(null, magentoOrderId);
              });
            });
          });
        });
      });
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

  return res.json(httpErrorCode, {code : err.name, message : err.message, errors : err.errors});
}
