'use strict';

var commerceAdapter = require('./commerce.adapter');
var paymentService = require('../payment/payment.service');
var loanService = require('../loan/loan.service');
var async = require('async');

function getUserOrders(user, cb) {
  var orders = [];
  commerceAdapter.orderList({customer_id: user.mageCustomerId}, function (err, magentoOrders) {
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
  commerceAdapter.orderLoad(orderId, function (err, magentoOrder) {
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

  commerceAdapter.orderList({customer_id: user.mageCustomerId}, function (err, magentoOrders) {
    if (err) {
      return cb(err);
    }
    async.eachSeries(magentoOrders, function (order, callback) {
      getOrder(user, order.incrementId, function (err, userOrder) {
        if (err) {
          return cb(err);
        }
        commerceAdapter.transactionList(order.incrementId, function (err, orderTransactions) {
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

exports.getUserOrders = getUserOrders;
exports.getOrder = getOrder;
exports.getUsertransactions = getUsertransactions;
