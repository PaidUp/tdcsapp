'use strict';

var loanService = require('../../loan/loan.service')
var config = require('../../../config/environment');
var tdCommerceService = require('TDCore').commerceService;


exports.placeOrder = function(user, cartId, addresses, orderData, cb){
  tdCommerceService.init(config.connections.commerce);
  tdCommerceService.customerCreate(user, function(err, customer) {
    if(err) {return cb(err);}
    tdCommerceService.cartAddress(cartId, addresses, function(err, data) {
      if(err) {return cb(err);}
      tdCommerceService.cartUpdateCustomer(cartId.cartId, customer, function(err, data) {
        if(err) {return cb(err);}
        tdCommerceService.cartSetShipping(cartId,function(err, dataShipping) {
          if(err) {return cb(err);}
          tdCommerceService.cartSetPayment(cartId, orderData.payment, function(err, dataPayment) {
            if(err) {return cb(err);}
            tdCommerceService.cartPlace(cartId, function(err, dataOrderId) {
              if(err) {return cb(err);}
              tdCommerceService.addCommentToOrder(dataOrderId, JSON.stringify(orderData), 'pending', function(err, comment) {
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


