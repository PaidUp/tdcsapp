'use strict';

var loanService = require('../../loan/loan.service')
var config = require('../../../config/environment');
var tdCommerceService = require('TDCore').commerceService;
var tdUserService = require('TDCore').userService;

exports.placeOrder = function(user, cartId, addresses, orderData, cb){
  tdCommerceService.init(config.connections.commerce);
  tdCommerceService.customerCreate(user, function(err, customer) {
    if(err) {return cb(err);}
    user.mageCustomerId = customer;
    tdUserService.init(config.connections.user);
    tdUserService.save(user, function(err, userPrepared){
      if(err) {return cb(err);}
      tdCommerceService.init(config.connections.commerce);
      tdCommerceService.cartAddress(cartId, addresses, function(err, data) {
        if(err) {return cb(err);}
        tdCommerceService.cartUpdateCustomer(cartId.cartId, userPrepared, function(err, data) {
          if(err) {return cb(err);}
          tdCommerceService.cartSetShipping(cartId.cartId,config.commerce.shippingMethod,function(err, dataShipping) {
            if(err) {return cb(err);}
            tdCommerceService.cartSetPayment(cartId.cartId, {method: config.commerce.paymentMethod,po_number: orderData.payment}, function(err, dataPayment) {
              if(err) {return cb(err);}
              tdCommerceService.cartPlace(cartId.cartId, function(err, dataOrderId) {
                if(err) {return cb(err);}
                tdCommerceService.orderCommentAdd(dataOrderId, JSON.stringify(orderData), 'pending', function(err, comment) {
                  if(err) {return cb(err);}
                  return cb(null, dataOrderId);
                });
              });
            });
          });
        });
      });
    });
  });
}

