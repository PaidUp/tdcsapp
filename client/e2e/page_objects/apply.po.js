'use strict';

var applyLoan = function () {

  this.fillForm = function(loanUser) {
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
};

module.exports = new applyLoan();
