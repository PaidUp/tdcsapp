'use strict';

var creditCardPayment = require('../page-objects/credit-card-payment.po');

var Utils = require('../utils/utils');
var models = require('../models');
var user = require('../user/user.helper.spec.js');
var athlete = require('../athletes/athlete.helper.spec.js');
var teamspo = require('../page-objects/teams.po');
var loanpo = require('../page-objects/loan.po');
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;
//var driver = new webdriver.Builder().withCapabilities(webdriver.Capabilities.firefox()).build();
var driver = browser.driver;
//var ptor = protractor.getInstance();


describe('Credit Workflow', function () {
    //beforeEach(function() {
      //browser.ignoreSynchronization = false;
    //});

  it("should be signed in", function () {
    browser.get('/').then(function () {
      user.signupUserEmail(models.signup);
    });
  });

  it("should register a child", function () {
    driver.wait(function () {
      return element(by.css('.my-athletes')).isDisplayed();
    }, 10000).then(function () {
      element(by.css('.my-athletes')).click();
      browser.getLocationAbsUrl().then(function (url) {
        console.log('url**********', url);
        expect(url).equal('/athletes/dashboard');
        var athleteModel = models.athlete;
        athlete.addAthlete(athleteModel);
      });
    });
  });
    

  it("should select a team for a selected child", function () {
    driver.wait(function () {
      return typeof element.all(by.repeater('athlete in athletes')).count === 'function';
    }, 10000).then(function () {
      athlete.selectAthlete();
      athlete.selectTeam(models.teamName);

      //var athleteFirstName = element(by.css('form select#select-athlete')).$('option:checked').getText();
      //console.log('athleteFirstName', athleteFirstName.getText());

      //expect(athleteFirstName).equal(models.athlete.firstName);
      //expect(element(by.binding('team.attributes.name')).getText()).equal(models.teamName);
      browser.wait(function () {
        return element(by.css('.magento-custom-options')).isDisplayed();
      }, 10000);

      teamspo.fillFormTeamForAthlete();

      browser.getLocationAbsUrl().then(function (url) {
        expect(url).equal('/commerce/cart/index');
        expect(browser.manage().getCookie('cartId')).to.exist;
        expect(browser.manage().getCookie('userId')).to.exist;
        element(by.id('proceed-to-checkout')).click();
        browser.getLocationAbsUrl().then(function (url) {
          expect(url).equal('/payment/creditcard');
        });
      });

    });


  });
/*
  it("should go to credit card payment", function() {
    //var tabs = element(by.css('.loan-tabs .nav.nav-tabs')).all(by.repeater('tab in tabs'));
    //expect(tabs.count()).toEqual(1);
    //tabs.get(1).click();
    browser.getLocationAbsUrl().then(function (url) {
        expect(url).toEqual('/payment/creditcard');
    });

    creditCardPayment.fillForm(models.creditCardDetails);

    expect(element(by.model('billing.address.address1')).getAttribute('value')).equal(models.creditCardDetails.address.address1);
    expect(element(by.model('billing.address.address2')).getAttribute('value')).equal(models.creditCardDetails.address.address2);
    expect(element(by.model('billing.address.city')).getAttribute('value')).toEqual(models.creditCardDetails.address.city);
    expect(element(by.model('billing.address.zipCode')).getAttribute('value')).equal(models.creditCardDetails.address.zipCode);
    expect(element(by.model('billing.phone')).getAttribute('value')).equal(models.creditCardDetails.phone);

    expect(element(by.model('$parent.card.nameOnCard')).getAttribute('value')).equal(models.creditCardDetails.card.nameOnCard);
    expect(element(by.model('$parent.card.cardNumber')).getAttribute('value')).equal(models.creditCardDetails.card.cardNumber);
    expect(element(by.model('$parent.card.expirationDate.month')).getAttribute('value')).equal(models.creditCardDetails.card.expirationDate.month);
    expect(element(by.model('$parent.card.expirationDate.year')).getAttribute('value')).equal(models.creditCardDetails.card.expirationDate.year);
    expect(element(by.model('$parent.card.securityCode')).getAttribute('value')).equal(models.creditCardDetails.card.securityCode);

    element(by.css('form[name=checkoutForm]')).submit();

    browser.wait(function () {
      return browser.isElementPresent(element(by.css('.titleThankyouBanner')));
    }, 15000);
    browser.getLocationAbsUrl().then(function (url) {
      expect(url).equal('/commerce/checkout/success');
      var thankyouTitle = element(by.css('.titleThankyouBanner')).getText();
      expect(thankyouTitle).equal('Thanks for your order!');
    });
  });
*/
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

  //it('should sign out', function(){
  //  user.signOut();
  //});

});