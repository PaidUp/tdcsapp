'use strict';

var loanService = require('../../loan/loan.service')
var config = require('../../../config/environment');
var tdCommerceService = require('TDCore').commerceService;
var tdUserService = require('TDCore').userService;
var emailNotification = require('../../../components/util/notifications/email-notifications');

exports.placeOrder = function(user, cartId, addresses, orderData, cb){
  tdCommerceService.init(config.connections.commerce);
  tdCommerceService.customerCreate(user, function(err, customer) {
    if(err) {return cb(err);}
    user.meta.TDCommerceId = customer;
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
                var paramsSchedule = {
                  productId :orderData.products[0].productId,
                  price: orderData.price,
                  isInFullPay: orderData.isInFullPay,
                  discount: orderData.discount};
                tdCommerceService.generateScheduleV2(paramsSchedule, function(err,schedule){
                  if(err) {return cb(err);}
                  schedule.meta = {
                    org_name : orderData.products[0].productSku,
                    sku : orderData.products[0].productPurchaseSku,
                    athlete_first_name : orderData.athleteFirstName,
                    athlete_last_name : orderData.athleteLastName
                  }
                  tdCommerceService.orderCommentAdd(dataOrderId, JSON.stringify(schedule), 'pending', function(err, comment) {
                    if(err) {return cb(err);}
                    tdCommerceService.orderCommentAdd(dataOrderId, JSON.stringify(orderData), 'pending', function(err, comment) {
                      if(err) {return cb(err);}
                      tdCommerceService.createOrderInvoice(dataOrderId, function(err, data){
                        if(err){
                          err.orderId = dataOrderId
                          emailNotification.sendNotification('Error create order invoice', err, function(err, data){
                          });
                        }else if(data.invoiceErr){
                          emailNotification.sendNotification('Error create order invoice', data, function(err, data){
                          });
                        }
                        return cb(null, dataOrderId, schedule);
                      });

                    });
                  });
                });


              });
            });
          });
        });
      });
    });
  });
}

