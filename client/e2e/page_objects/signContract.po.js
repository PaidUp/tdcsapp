'use strict';

var signContract = function () {

  this.setData = function () {
    this.loanAmount = element(by.binding('paymentPlan.loanAmount')).getAttribute('value');
    this.term = element(by.binding('paymentPlan.term')).getAttribute('value');
    this.apr = element(by.binding('paymentPlan.apr')).getAttribute('value');
    this.monthlyPayment = element(by.binding('paymentPlan.monthlyPayment')).getAttribute('value');
  };

  this.fillForm = function(userLoan) {
    element(by.model('signContract.firstName')).sendKeys(userLoan.firstname);
    element(by.model('signContract.lastName')).sendKeys(userLoan.lastname);
    element(by.model('signContract.ssn')).sendKeys(userLoan.inputSSN.substr(userLoan.inputSSN.length-4, 4));
  };
};

module.exports = new signContract();
