'use strict';

var models = require('../../models');
var loanPayment = require('../../page_objects/loanPayment.po');

exports.goToPayment = function() {
  element(by.css('.dropdown')).click();
  var ProfileLink = element(by.css('.dropdown .dropdown-menu')).element(by.css('li > a'));
  expect(ProfileLink.getText()).toEqual('Profile');
  ProfileLink.click();

  browser.getLocationAbsUrl().then(function (url) {

    expect(url).toEqual('/user/account');
    var tabs = element(by.css('.user-tabs .nav.nav-tabs')).all(by.repeater('tab in tabs'));
    expect(tabs.count()).toEqual(3);
    tabs.get(1).click();

    browser.getLocationAbsUrl().then(function (url) {
      expect(url).toEqual('/user/payments');
    });
  });
};

exports.createNewBankAccount = function(bankDetails){
  var newBankAccount = element(by.css('.new-bank-account > a'));
  expect(newBankAccount.getText()).toEqual('LINK NEW ACCOUNT');
  newBankAccount.click();

  browser.getLocationAbsUrl().then(function (url) {
    expect(url).toEqual('/user/bank/account/create');

    loanPayment.fillForm(bankDetails);
    element(by.id('payment-btn')).click();

    browser.wait(function () {
      return browser.isElementPresent(element(by.css('.new-bank-account > a')));
    }, 15000);

    browser.getLocationAbsUrl().then(function (url) {
      expect(url).toEqual('/user/payments');
      var bankAccounts = element.all(by.repeater('account in bankAccounts'));
      //expect(bankAccounts.count()).toEqual(1);
      expect(
        bankAccounts.get(0).
        element(by.css('[ng-show="account.state === \'pending\'"]')).isDisplayed()
      ).toBe(true);
    });
  });
};