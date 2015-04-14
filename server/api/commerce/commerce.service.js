'use strict';

var paymentService = require('../payment/payment.service');
var loanService = require('../loan/loan.service');
var async = require('async');
var TDCommerceService = require('TDCore').commerceService;
var config = require('../../config/environment');
var logger = require('../../config/logger');
TDCommerceService.init(config.connections.commerce);

var ORDER_STATUS = {
  HOLD  : 'hold',
  CANCEL : 'cancel'
}

function getUserOrders(user, cb) {
  var orders = [];
  TDCommerceService.init(config.connections.commerce);
  TDCommerceService.orderList({customer_id: user.mageCustomerId}, function (err, magentoOrders) {
    if (err) {
      return cb(err);
    }
    async.eachSeries(magentoOrders, function (order, callback) {
      getOrder(user, order.incrementId, function (err, magentoOrder) {
        if (err) {
          callback(err);
        }
        orders.push(magentoOrder);
        callback();
      });
    }, function (err) {
      if (err) { return cb(err); }
      return cb(null, orders);
    });
  });
}

function getOrder(user, orderId, cb) {
  TDCommerceService.init(config.connections.commerce);
  TDCommerceService.orderLoad(orderId, function (err, magentoOrder) {
    if (err) return cb(err);
    if (magentoOrder.paymentMethod === 'directdebit') {
      loanService.findOne({orderId: orderId}, function (err, loan) {
        if (err) {
          return cb(err, magentoOrder);
        }
        magentoOrder.loan = loan;
        paymentService.getUserDefaultBankId(user, function (err, bankId) {
          if (err) {
            // not-available-payment
            // not-bank-verified
            magentoOrder.bankError = err;
            return cb(null, magentoOrder);
          }
          else {
            paymentService.fetchBank(bankId, function (err, bank) {
              if (err) {
                return cb(err);
              }
              magentoOrder.bank = bank;
              return cb(null, magentoOrder);
            });
          }
        });
      });
    } else if (magentoOrder.paymentMethod === 'creditcard') {
      paymentService.fetchCard(magentoOrder.cardId, function (err, card) {
        if (err) {
          return cb(err);
        }
        magentoOrder.card = card;
        return cb(null, magentoOrder);
      });
    }
    else {
      return cb(null, magentoOrder);
    }
  });
}

function getUsertransactions(user, cb) {
  var transactions = [];
  TDCommerceService.init(config.connections.commerce);
  TDCommerceService.orderList({customer_id: user.mageCustomerId}, function (err, magentoOrders) {
    if (err) {
      return cb(err);
    }
    async.eachSeries(magentoOrders, function (order, callback) {
      getOrder(user, order.incrementId, function (err, userOrder) {
        if (err) {
          return cb(err);
        }
        TDCommerceService.transactionList(order.incrementId, function (err, orderTransactions) {
          if (err) {
            return cb(err);
          }
          var transaction = {
            transactions: orderTransactions,
            order: userOrder
          };
          transactions.push(transaction);
          callback();
        });
      });
    }, function (err) {
      if (err) { return cb(err); }
      return cb(null, transactions);
    });
  });
}

function addCommentToOrder(orderId, comment, status, cb) {
  TDCommerceService.init(config.connections.commerce);
  TDCommerceService.orderCommentAdd(orderId, comment, status, function (err, data) {
    if (err) return cb(err);
    return cb(null,data);
  });
}

function addTransactionToOrder(orderId, transactionId, details, cb) {
  TDCommerceService.init(config.connections.commerce);
  TDCommerceService.transactionCreate(orderId, transactionId, details, function (err, data) {
    if (err) return cb(err);
    return cb(null,data);
  });
}

function orderHold(orderId, cb) {
  TDCommerceService.init(config.connections.commerce);
  TDCommerceService.orderUpdateStatus(orderId, ORDER_STATUS.HOLD, function (err, data) {
    if (err) return cb(err);
    return cb(null,data);
  });
}

function orderCancel(orderId, cb) {
  TDCommerceService.init(config.connections.commerce);
  TDCommerceService.orderUpdateStatus(orderId, ORDER_STATUS.CANCEL, function (err, data) {
    if (err) return cb(err);
    return cb(null,data);
  });
}

function orderList(filter, cb){
  TDCommerceService.init(config.connections.commerce);
  TDCommerceService.orderList({filter : filter}, function (err, data) {
    if (err) return cb(err);
    return cb(null,data);
  });
}

function orderLoad(orderId, cb){
  TDCommerceService.init(config.connections.commerce);
  TDCommerceService.orderLoad(orderId, function (err, data) {
    if (err) return cb(err);
    return cb(null,data);
  });
}

exports.addCommentToOrder = addCommentToOrder;
exports.addTransactionToOrder = addTransactionToOrder;
exports.orderHold = orderHold;
exports.getUserOrders = getUserOrders;
exports.getOrder = getOrder;
exports.getUsertransactions = getUsertransactions;
exports.orderList = orderList;
exports.orderLoad = orderLoad;
exports.orderCancel = orderCancel;
