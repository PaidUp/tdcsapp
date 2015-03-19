'use strict';

var loan = function () {

  this.fillFormApplyLoan = function(loanUser) {
    element(by.model('billing.address.address1')).sendKeys(loanUser.address.address1);
    element(by.model('billing.address.address2')).sendKeys(loanUser.address.address2);
    element(by.model('billing.address.city')).sendKeys(loanUser.address.city);
    element(by.model('billing.address.state')).sendKeys(loanUser.address.state);
    element(by.model('billing.address.zipCode')).sendKeys(loanUser.address.zipCode);
    element(by.model('billing.phone')).sendKeys(loanUser.phone);

    var selectIncomeType = element(by.model('incomeInfo.type'));
    selectIncomeType.all(by.repeater('type in incomeInfoTypes')).count().then(function (count) {
      var selection = Math.ceil(Math.random() * count);
      if (selection === 1) { selection++; }
      selectIncomeType.$('option:nth-child('+selection+')').click();
    });
    element(by.model('inputSSN')).sendKeys(loanUser.inputSSN);
    element(by.model('incomeInfo.monthlyGrossIncome')).sendKeys(loanUser.monthlyGrossIncome);
    element(by.id('agree-checkbox')).click();
  };

  this.setData = function () {
    this.loanAmount = element(by.binding('paymentPlan.loanAmount')).getAttribute('value');
    this.term = element(by.binding('paymentPlan.term')).getAttribute('value');
    this.apr = element(by.binding('paymentPlan.apr')).getAttribute('value');
    this.monthlyPayment = element(by.binding('paymentPlan.monthlyPayment')).getAttribute('value');
  };

  this.fillFormPayment = function(bankDetails) {
    element(by.model('inputRoutingNumber')).sendKeys(bankDetails.routingNumber);
    element(by.model('inputRoutingNumberVerification')).sendKeys(bankDetails.routingNumber);
    element(by.model('inputAccountNumber')).sendKeys(bankDetails.accountNumber);
    element(by.model('inputAccountNumberVerification')).sendKeys(bankDetails.accountNumber);
  };

  this.fillFormSignContract = function(userLoan) {
    element(by.model('signContract.firstName')).sendKeys(userLoan.firstname);
    element(by.model('signContract.lastName')).sendKeys(userLoan.lastname);
    element(by.model('signContract.ssn')).sendKeys(userLoan.inputSSN.substr(userLoan.inputSSN.length-4, 4));
  };

};

module.exports = new loan();