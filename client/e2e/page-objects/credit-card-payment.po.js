'use strict';

var Utils = require('../utils/utils');

var creditCardPayment = function () {

  this.fillForm = function(userCreditCard) {
    element(by.model('billing.address.address1')).sendKeys(userCreditCard.address.address1);
    element(by.model('billing.address.address2')).sendKeys(userCreditCard.address.address2);
    element(by.model('billing.address.city')).sendKeys(userCreditCard.address.city);

    var selectStates = element(by.id('selectState')).all(by.repeater('state in states'));
    Utils.selectItem(selectStates, { chopFirst: true }).then(function (state) {
      state.click();
    });

    element(by.model('billing.address.zipCode')).sendKeys(userCreditCard.address.zipCode);
    element(by.model('billing.phone')).sendKeys(userCreditCard.phone);

    element(by.model('$parent.card.nameOnCard')).sendKeys(userCreditCard.card.nameOnCard);
    element(by.model('$parent.card.cardNumber')).sendKeys(userCreditCard.card.cardNumber);
    element(by.model('$parent.card.expirationDate.month')).sendKeys(userCreditCard.card.expirationDate.month);
    element(by.model('$parent.card.expirationDate.year')).sendKeys(userCreditCard.card.expirationDate.year);
    element(by.model('$parent.card.securityCode')).sendKeys(userCreditCard.card.securityCode);

    //element(by.id('agreeCheckbox')).click();
  };
};

module.exports = new creditCardPayment();
