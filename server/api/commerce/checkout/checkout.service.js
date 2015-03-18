'use strict';

var loanService = require('../../loan/loan.service')
var config = require('../../../config/environment');
var TDCommerceService = require('TDCore').commerceService;
TDCommerceService.init(config.connections.commerce);

exports.placeOrder = function(user, cartId, addresses, orderData, cb){
  TDCommerceService.prepareCustomer(user, function(err, customer) {
    if(err) {return cb(err);}
    TDCommerceService.cartAddress(cartId, addresses, function(err, data) {
      if(err) {return cb(err);}
      TDCommerceService.cartCustomer(cartId, customer, function(err, data) {
        if(err) {return cb(err);}
        TDCommerceService.setShipping(cartId,function(err, dataShipping) {
          if(err) {return cb(err);}
          TDCommerceService.setPayment(cartId, orderData.payment, function(err, dataPayment) {
            if(err) {return cb(err);}
            TDCommerceService.placeOrder(cartId, function(err, dataOrderId) {
              if(err) {return cb(err);}
              TDCommerceService.addCommentToOrder(dataOrderId, JSON.stringify(orderData), 'pending', function(err, comment) {
                if(err) {return cb(err);}
                return cb(null, dataOrderId);
              });
            });
          });
        });
      });
    });
  });
}


