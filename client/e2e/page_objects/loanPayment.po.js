'use strict';

var loanPayment = function () {

  this.setData = function () {
    this.loanAmount = element(by.binding('paymentPlan.loanAmount')).getAttribute('value');
    this.term = element(by.binding('paymentPlan.term')).getAttribute('value');
    this.apr = element(by.binding('paymentPlan.apr')).getAttribute('value');
    this.monthlyPayment = element(by.binding('paymentPlan.monthlyPayment')).getAttribute('value');
  };

  this.fillForm = function(bankDetails) {
    element(by.model('inputRoutingNumber')).sendKeys(bankDetails.routingNumber);
    element(by.model('inputRoutingNumberVerification')).sendKeys(bankDetails.routingNumber);
    element(by.model('inputAccountNumber')).sendKeys(bankDetails.accountNumber);
    element(by.model('inputAccountNumberVerification')).sendKeys(bankDetails.accountNumber);
  };
};

module.exports = new loanPayment();
