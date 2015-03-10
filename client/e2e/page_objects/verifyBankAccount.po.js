'use strict';

var verifyBankAccount = function () {

  this.verifyAccount = function(value1, value2) {
    element(by.model('deposit1')).sendKeys(value1);
    element(by.model('deposit2')).sendKeys(value2);
    element(by.css('.btn-verifyAccount')).click();
  };

  this.clearFormVerifyAccount = function() {
    element(by.model('deposit1')).clear();
    element(by.model('deposit2')).clear();
  }; 
  
};

module.exports = new verifyBankAccount();