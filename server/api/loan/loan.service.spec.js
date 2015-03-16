'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');
var assert = require('chai').assert;
var loanService = require('./loan.service');
var moment = require('moment');

describe('loanService', function(){
  this.timeout(5000);

  /*
  TODO: it needs to create a Loan and trigger a capture
  it('captureLoanSchedule', function(done){
    loanService.findOne({_id:'54b1602b6ff538830d437345'}, function(err, loan){
      loanService.captureLoanSchedule(loan, 0, function(err, data){
        done();
      });
    });

  });
  */

/*
  it('loanJS.loan', function(done){
    // amount,installments number, interest rate, diminishin, period, periodType
    var amount = 2000;
    var numberPayments = 10;
    var interestRate = 8.99;
    var periodDuration = 1;
    var periodType = "minutes";
    var initialDate = moment("2015-01-20 08:00:00");

    var loan = new LoanJS.Loan(amount, numberPayments, interestRate, false, periodDuration, periodType, initialDate);
    console.log(loan);
    done();

  });
*/

  it('simulate', function(done){
    var amount = 2000;
    var numberPayments = 6;
    var interestRate = 8.99;
    var periodDuration = 1;
    var periodType = "minutes";

    loanService.simulate(amount, numberPayments, interestRate, periodDuration, periodType, function(err, data){
      if(err) {
        done(err);
      }
      else {
        console.log(data);
        done();
      }
    });
  });

});

