'use strict';

var Utils = require('../utils/utils');

var credentials = function () {
  
  this.fillFormContact = function (credentials) {
  	
  	element(by.model('shipping.phone')).sendKeys(credentials.phone);

    element(by.model('shipping.address.address1')).sendKeys(credentials.address.address1);
    element(by.model('shipping.address.address2')).sendKeys(credentials.address.address2);
    element(by.model('shipping.address.city')).sendKeys(credentials.address.city);

    var selectStates = element(by.id('state')).all(by.repeater('state in states'));
    Utils.selectItem(selectStates, { chopFirst: true }).then(function (state) {
      state.click();
    });

    element(by.model('shipping.address.zipCode')).sendKeys(credentials.address.zipCode);

    this.phone = element(by.model('shipping.phone')).getAttribute('value');

    this.address1 = element(by.model('shipping.address.address1')).getAttribute('value');
    this.address2 = element(by.model('shipping.address.address2')).getAttribute('value');
    this.city = element(by.model('shipping.address.city')).getAttribute('value');
  };

  this.fillFormPassword = function (oldPassword, newPassword) {

  };
};

module.exports = new credentials();