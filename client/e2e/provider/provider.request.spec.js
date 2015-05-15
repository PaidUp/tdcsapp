'use strict';
//var creditCardPayment = require('../page-objects/credit-card-payment.po');

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

describe('Provider request', function () {

  it("should be signed in", function () {
    browser.get('/commerce/provider/landing').then(function () {
      user.signupUserEmail(models.signup);
    });
  });

  it("should fill form provider request", function() {
    browser.getLocationAbsUrl().then(function (url) {
        expect(url).equal('/commerce/provider/request');
    });

    //jesse//creditCardPayment.fillForm(models.creditCardDetails);
    //jesse//providerForm.fillForm(models.provider);

    /*
    element(by.css('form[name=checkoutForm]')).submit();
    browser.wait(function () {
      return browser.isElementPresent(element(by.css('.titleThankyouBanner')));
    }, 15000);
    browser.getLocationAbsUrl().then(function (url) {
      expect(url).equal('/commerce/checkout/success');
      var thankyouTitle = element(by.css('.titleThankyouBanner')).getText();
      expect(thankyouTitle).equal('Thanks for your order!');
    });
    */
  });

  it('should sign out', function(){
    user.signOut();
  });

});