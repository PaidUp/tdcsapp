'use strict';

var moment = require('moment');
var logger = require('../../config/logger');
var LoanJS = require('loanjs');
var loan = require('./loan.model');
var config = require('../../config/environment');
var commerceService = require('../commerce/commerce.service');
var paymentService = require('../payment/payment.service');
var userService = require('../user/user.service');
var paymentEmailService = require('../payment/payment.email.service');

function simulate(amount, numberPayments, interestRate, periodDuration, periodType, cb) {
  var billingDate = moment();
  if(config.loan.defaults.billingDate !== '') {
    billingDate = moment(config.loan.defaults.billingDate, config.loan.defaults.billingFormat);
  }
  if(! billingDate.isValid()) {
    return cb({name: 'Invalid date'});
  }
  var now = moment();

  // make sure there is a 3 days difference
  if(billingDate.clone().subtract(config.loan.defaults.billingDelay, config.loan.defaults.billingDelayType) < now) {
    billingDate = now.add(config.loan.defaults.billingDelay, config.loan.defaults.billingDelayType);
  }

	var loan = new LoanJS.Loan(amount, numberPayments, interestRate, false, periodDuration, periodType, billingDate);
	return cb(null, loan);
}

function isValidNumberPayments(numberPayments) {
	if (typeof numberPayments === 'number' && numberPayments > 0) {
		return true;
	}
	return false;
}

function isValidAmount(amount) {
	if (typeof amount === 'number' && amount > 0) {
		return true;
	}
	return false;
}

function save(loan, cb) {
  loan.save(function(err, data) {
    if(err) {
      return cb(err);
    }
    return cb(null, data);
  });
}

function findOne(filter, cb) {
  loan.findOne(filter, function(err, data) {
      if(err) {
        return cb(err);
      }
      return cb(null, data);
    }
  );
}

function find(filter, cb) {
  loan.find(filter, function(err, data) {
      if(err) {
        return cb(err);
      }
      return cb(null, data);
    }
  );
}

function captureLoanSchedule(loan, scheduledIndex, cb) {
  logger.log('info', 'Charging loan: ' + loan.id + ' scheduled payment: ' + (scheduledIndex + 1));
  var amount = loan.schedule[scheduledIndex].installment;
  // Get Magento Order
  commerceService.orderLoad(loan.orderId, function(err,order){
    userService.findOne({_id:order.userId}, function(err, user){
      paymentService.capture(order, user, order.products[0].BPCustomerId, amount, order.paymentMethod, function(captureErr, data){
        if (captureErr) {
          // Stop loan
          logger.log('info', 'Stopping loan: ' + loan.id);
          loan.state = 'delinquent';
          loan.schedule[scheduledIndex].state = 'failed';
          loan.markModified('schedule');
          save(loan, function (err, dataLoan) {
            if(captureErr.name === 'not-bank-verified') {
              paymentEmailService.sendFinalEmail(user, amount, loan.orderId, function (error, data) {
                logger.log('info', 'Send email capture failed. ');
                return cb(err);
              });
            }else{//captureErr.name === 'not-available-payment'
              logger.info('loose... '+ captureErr.name);
              return cb(captureErr);
            }
          });
        }
        else {
          // All good, schedule captured
          loan.schedule[scheduledIndex].state = 'paid';
          loan.markModified('schedule');
          save(loan, function (err, dataLoan) {
            paymentEmailService.sendProcessedEmail(user, amount, loan.orderId, function(err, data){
              logger.log('info', 'Send email capture processed. ');
            });
            return cb(err);
          });
          return cb(null, data);
        }
      });
    });
  });

}

exports.simulate = simulate;
exports.save = save;
exports.findOne = findOne;
exports.find = find;
exports.isValidNumberPayments = isValidNumberPayments;
exports.isValidAmount = isValidAmount;
exports.captureLoanSchedule = captureLoanSchedule;
