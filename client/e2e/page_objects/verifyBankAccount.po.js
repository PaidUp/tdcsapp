'use strict';

var verifyBankAccount = function () {

  this.fillFormSuccess = function(bankDetails) {
    element(by.model('deposit1')).sendKeys(bankDetails.valueVerifyAccount);
    element(by.model('deposit2')).sendKeys(bankDetails.valueVerifyAccount);
  };

  this.fillFormError = function(bankDetails) {
    element(by.model('inputRoutingNumber')).sendKeys(bankDetails.routingNumber);
    element(by.model('inputRoutingNumberVerification')).sendKeys(bankDetails.accountNumber);
    element(by.model('inputAccountNumber')).sendKeys(bankDetails.accountNumber);
    element(by.model('inputAccountNumberVerification')).sendKeys(bankDetails.routingNumber);
  };

  this.clearFormNewAccount = function() {
    element(by.model('inputRoutingNumber')).clear();
    element(by.model('inputRoutingNumberVerification')).clear();
    element(by.model('inputAccountNumber')).clear();
    element(by.model('inputAccountNumberVerification')).clear();
  };

  this.clearFormVerifyAccount = function() {
    element(by.model('deposit1')).clear();
    element(by.model('deposit2')).clear();
  }; 

  this.submitForm = function(objeto) {
    element(by.css(objeto)).click();
  };

  this.verifyAccount = function(bankDetails) {
    this.fillFormSuccess(bankDetails);
    element(by.css('.btn-verifyAccount')).click();
  };
};

module.exports = new verifyBankAccount();