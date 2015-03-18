'use strict';

var paymentService = require('../payment/payment.service');
var loanService = require('../loan/loan.service');
var async = require('async');
var TDCommerceService = require('TDCore').commerceService;
TDCommerceService.init(config.connections.commerce);

function getUserOrders(user, cb) {
  var orders = [];
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
  TDCommerceService.orderCommentAdd(orderId, comment, status, function (err, data) {
    if (err) return cb(err);
    return cb(null,data);
  });
}

function addTransactionToOrder(orderId, transactionId, details, cb) {
  TDCommerceService.transactionCreate(orderId, transactionId, details, function (err, data) {
    if (err) return cb(err);
    return cb(null,data);
  });
}

function orderHold(orderId, cb) {
  TDCommerceService.orderHold(orderId, function (err, data) {
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
