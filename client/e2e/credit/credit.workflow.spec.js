'use strict';

var signuppo = require('../page_objects/signup.po.js');
var addAthlete = require('../page_objects/add-athlete.po.js');
var models = require('../models');
var Utils = require('../utils/utils');
var Async = require('async');
var selectTeamForAthlete = require('../page_objects/selectTeamForAthlete.po');
var loanApply = require('../page_objects/apply.po');
var signContract = require('../page_objects/signContract.po');
var loanPayment = require('../page_objects/loanPayment.po');
var creditCardPayment = require('../page_objects/creditCardPayment.po');

describe('Credit Workflow', function() {

  beforeEach(function() {});

  it("should be signed in", function() {
    // browser.get('/');
    signuppo.openSignupModal();

    var signupModel = models.signup;
    signuppo.fillFormByEmail(signupModel);

    element(by.css('#submit-email-login')).click();
    browser.waitForAngular();
    element(by.css('.verify-email-modal .close')).click();
  });

  it("should register a child", function() {
    element(by.css('button#add-athlete-btn')).click();
    browser.waitForAngular();

    var athleteModel = models.athlete;

    addAthlete.fillForm(athleteModel);

    element(by.css('button[type=submit]')).click();
    browser.wait(function () {
      return browser.isElementPresent(element(by.repeater('athlete in athletes')));
    }, 10000);
  });

  it("should select a team for a selected child", function() {
    element.all(by.repeater('athlete in athletes')).get(0).click();
    browser.waitForAngular();
    browser.getLocationAbsUrl().then(function (url) {
      browser.wait(function () {
        return element(by.css('.container.teams')).isDisplayed();
      }, 10000);
      var team = element(by.cssContainingText('.team-name', models.teamName));
      team.click();
      browser.waitForAngular();
      browser.getLocationAbsUrl().then(function (url) {
        browser.wait(function () {
          return element(by.css('.magento-custom-options')).isDisplayed();
        }, 10000);
        selectTeamForAthlete.fillFormOptions();
      });
    });
  });

  it("should go to credit card payment", function() {
    var tabs = element(by.css('.loan-tabs .nav.nav-tabs')).all(by.repeater('tab in tabs'));
    expect(tabs.count()).toEqual(2);
    tabs.get(1).click();
    browser.getLocationAbsUrl().then(function (url) {
        expect(url).toEqual('/payment/creditcard');
    });

    creditCardPayment.fillForm(models.creditCardDetails);

    expect(element(by.model('billing.address.address1')).getAttribute('value')).toEqual(models.creditCardDetails.address.address1);
    expect(element(by.model('billing.address.address2')).getAttribute('value')).toEqual(models.creditCardDetails.address.address2);
    expect(element(by.model('billing.address.city')).getAttribute('value')).toEqual(models.creditCardDetails.address.city);
    expect(element(by.model('billing.address.zipCode')).getAttribute('value')).toEqual(models.creditCardDetails.address.zipCode);
    expect(element(by.model('billing.phone')).getAttribute('value')).toEqual(models.creditCardDetails.phone);

    expect(element(by.model('$parent.card.nameOnCard')).getAttribute('value')).toEqual(models.creditCardDetails.card.nameOnCard);
    expect(element(by.model('$parent.card.cardNumber')).getAttribute('value')).toEqual(models.creditCardDetails.card.cardNumber);
    expect(element(by.model('$parent.card.expirationDate.month')).getAttribute('value')).toEqual(models.creditCardDetails.card.expirationDate.month);
    expect(element(by.model('$parent.card.expirationDate.year')).getAttribute('value')).toEqual(models.creditCardDetails.card.expirationDate.year);
    expect(element(by.model('$parent.card.securityCode')).getAttribute('value')).toEqual(models.creditCardDetails.card.securityCode);

    element(by.css('form[name=checkoutForm]')).submit();

    browser.wait(function () {
      return browser.isElementPresent(element(by.css('.titleThankyouBanner')));
    }, 15000);
    browser.getLocationAbsUrl().then(function (url) {
      expect(url).toEqual('/commerce/checkout/success');
      var thankyouTitle = element(by.css('.titleThankyouBanner')).getText();
      expect(thankyouTitle).toEqual('Thanks for your order!');
    });

  });

  // we could not check the existence of the credit card,
  // until the payment has benn proceesed by balance payments

//  it("should have a credit card", function() {
//    element(by.css('.dropdown')).click();
//    var ProfileLink = element(by.css('.dropdown .dropdown-menu')).element(by.css('li > a'));
//    expect(ProfileLink.getText()).toEqual('Profile');
//    ProfileLink.click();
//    browser.getLocationAbsUrl().then(function (url) {
//      expect(url).toEqual('/user/account');
//      var tabs = element(by.css('.user-tabs .nav.nav-tabs')).all(by.repeater('tab in tabs'));
//      expect(tabs.count()).toEqual(3);
//      tabs.get(1).click();
//      browser.getLocationAbsUrl().then(function (url) {
//        expect(url).toEqual('/user/payments');
//        var creditCardAccounts = element.all(by.repeater('card in cards'));
//        expect(creditCardAccounts.count()).toEqual(1);
////        expect(creditCardAccounts.get(0).element(by.css('[ng-show="account.state === \'pending\'"]')).isDisplayed()).toBe(true);
////        creditCardAccounts.get(0).element(by.css('.verify-bank')).click();
//        browser.getLocationAbsUrl().then(function (url) {
//          // url -> /user/payments/bank/:bankId/verify/:verifyId
////          var ids = Utils.getIdsfromUrl(url, [3, 5]);
////          var bankId = ids[0];
////          var verificationId = ids[1];
////          expect(url).toEqual('/user/payments/bank/' + bankId + '/verify/' + verificationId);
//        });
//      });
//    });
//  });

});
