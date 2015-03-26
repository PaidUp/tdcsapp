'use strict';

var loanService = require('../../loan/loan.service')
var config = require('../../../config/environment');
var tdCommerceService = require('TDCore').commerceService;


exports.placeOrder = function(user, cartId, addresses, orderData, cb){
  tdCommerceService.init(config.connections.commerce);
  tdCommerceService.prepareCustomer(user, function(err, customer) {
    if(err) {return cb(err);}
    tdCommerceService.cartAddress(cartId, addresses, function(err, data) {
      if(err) {return cb(err);}
      tdCommerceService.cartCustomer(cartId, customer, function(err, data) {
        if(err) {return cb(err);}
        tdCommerceService.setShipping(cartId,function(err, dataShipping) {
          if(err) {return cb(err);}
          tdCommerceService.setPayment(cartId, orderData.payment, function(err, dataPayment) {
            if(err) {return cb(err);}
            tdCommerceService.cartSetPayment(cartId.cartId, {method: config.commerce.paymentMethod,po_number: orderData.payment}, function(err, dataPayment) {
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


