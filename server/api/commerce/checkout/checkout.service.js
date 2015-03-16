'use strict';

var commerceAdapter = require('../commerce.adapter');
var loanService = require('../../loan/loan.service')
var config = require('../../../config/environment/index');

exports.placeOrder = function(user, cartId, addresses, orderData, cb){
  commerceAdapter.prepareCustomer(user, function(err, customer) {
    if(err) {return cb(err);}
    commerceAdapter.cartAddress(cartId, addresses, function(err, data) {
      if(err) {return cb(err);}
      commerceAdapter.cartCustomer(cartId, customer, function(err, data) {
        if(err) {return cb(err);}
        commerceAdapter.setShipping(cartId,function(err, dataShipping) {
          if(err) {return cb(err);}
          commerceAdapter.setPayment(cartId, orderData.payment, function(err, dataPayment) {
            if(err) {return cb(err);}
            commerceAdapter.placeOrder(cartId, function(err, dataOrderId) {
              if(err) {return cb(err);}
              commerceAdapter.addCommentToOrder(dataOrderId, JSON.stringify(orderData), 'pending', function(err, comment) {
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


