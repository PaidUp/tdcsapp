'use strict';

var Utils = require('../utils/utils');
var models = require('../models');
var user = require('../user/user.helper.spec.js');
var athlete = require('../athletes/athlete.helper.spec.js');
var teamspo = require('../page-objects/teams.po');
var loanpo = require('../page-objects/loan.po');

describe('Loan Workflow', function () {

  beforeEach(function () {});

  it("should be signed in", function () {
    user.signupUserEmail(models.signup);
  });

  it("should register a child", function () {
    element(by.css('.my-athletes')).click();
    browser.getLocationAbsUrl().then(function (url) {
      expect(url).toEqual('/athletes/dashboard');
      var athleteModel = models.athlete;
      athlete.addAthlete(athleteModel);
    });
  });

  it("should select a team for a selected child", function () {
    athlete.selectAthlete();
    athlete.selectTeam(models.teamName);
     
    var athleteFirstName = element(by.css('form select#select-athlete')).$('option:checked').getText();
    expect(athleteFirstName).toEqual(models.athlete.firstName);
    expect(element(by.binding('team.attributes.name')).getText()).toEqual(models.teamName);
    browser.wait(function () {
      return element(by.css('.magento-custom-options')).isDisplayed();
    }, 10000);

    teamspo.fillFormTeamForAthlete();

    browser.getLocationAbsUrl().then(function (url) {
      expect(url).toEqual('/commerce/cart/index');
      expect(browser.manage().getCookie('cartId')).toBeDefined();
      expect(browser.manage().getCookie('userId')).toBeDefined();
      element(by.id('proceed-to-checkout')).click();
      browser.getLocationAbsUrl().then(function (url) {
        expect(url).toEqual('/payment/loan');
      });
    });
  });

  it("should apply to loan", function () {
    var userLoan = models.userLoan;

    element(by.css('.loan-apply-btn')).click();
    browser.getLocationAbsUrl().then(function (url) {
      expect(url).toEqual('/payment/loan/apply');
      var name = element(by.model('user.firstName')).getAttribute('value');
      var lastName = element(by.model('user.lastName')).getAttribute('value');
      expect(name).toEqual(userLoan.firstname);
      expect(lastName).toEqual(userLoan.lastname);

      loanpo.fillFormApplyLoan(userLoan);

      element(by.css('form[name=loanApplyForm]')).submit();
      // browser.waitForAngular();
      browser.getLocationAbsUrl().then(function (url) {
        expect(url).toEqual('/payment/loan/signcontract');
      });
    });
  });

  it("should sign the loan contract", function () {
    loanpo.setData();

    expect(element(by.binding('contractHTML')).getText()).not.toEqual('');
    expect(loanpo.loanAmount).not.toEqual('');
    expect(loanpo.term).not.toEqual('');
    expect(loanpo.apr).not.toEqual('');
    expect(loanpo.monthlyPayment).not.toEqual('');

    loanpo.fillFormSignContract(models.userLoan);

    element(by.css('form[name=signContractForm]')).submit();
    browser.waitForAngular();
    browser.getLocationAbsUrl().then(function (url) {
      expect(url).toEqual('/payment/loan/payment');
    });
  });

  it("should place a payment", function () {
    loanpo.setData();

    expect(loanpo.loanAmount).not.toEqual('');
    expect(loanpo.term).not.toEqual('');
    expect(loanpo.apr).not.toEqual('');
    expect(loanpo.monthlyPayment).not.toEqual('');

    expect(element.all(by.repeater('(index, payment) in paymentSchedule')).count()).toBeGreaterThan(0);

    loanpo.fillFormPayment(models.bankDetails);

    // this is because we need to ng-blur to take effect
    // element(by.id('check-img')).click();
    // element(by.css('form[name=paymentForm]')).submit();
    element(by.id('payment-btn')).click();
    browser.wait(function () {
      return browser.isElementPresent(element(by.css('.titleThankyouBanner')));
    }, 15000);
    browser.getLocationAbsUrl().then(function (url) {
      expect(url).toEqual('/commerce/checkout/success');
      var thankyouTitle = element(by.css('.titleThankyouBanner')).getText();
      expect(thankyouTitle).toEqual('Thanks for your order!');
    });
  });

  // Verify bank account
  // it("should have a bank account", function() {

  //   // browser.get('/user/payments');
  //   element(by.css('.dropdown')).click();
  //   var ProfileLink = element(by.css('.dropdown .dropdown-menu')).element(by.css('li > a'));
  //   expect(ProfileLink.getText()).toEqual('Profile');
  //   ProfileLink.click();
  //   browser.getLocationAbsUrl().then(function (url) {
  //     expect(url).toEqual('/user/account');
  //     var tabs = element(by.css('.user-tabs .nav.nav-tabs')).all(by.repeater('tab in tabs'));
  //     // console.log('TABS:\n');
  //     // tabs.each(function(tab) {
  //     //   tab.getWebElement().getInnerHtml().then(function (html) {
  //     //     console.log(html)
  //     //   });
  //     // });
  //     // 1 is the array index where we can find the User Payment Methods Tab
  //     expect(tabs.count()).toEqual(3);
  //     tabs.get(1).click();

  //     browser.getLocationAbsUrl().then(function (url) {
  //       expect(url).toEqual('/user/payments');
  //     });
  //   });
  // });

  // it('should verify bank account with pending status', function() {
  //   var bankAccounts = element.all(by.repeater('account in bankAccounts'));
  //   expect(bankAccounts.count()).toEqual(1);
  //   expect(
  //     bankAccounts.get(0).
  //     element(by.css('[ng-show="account.state === \'pending\'"]')).isDisplayed()
  //   ).toBe(true);
  //   bankAccounts.get(0).element(by.css('.verify-bank')).click();
    
  //   browser.getLocationAbsUrl().then(function (url) {
  //     var ids = Utils.getIdsfromUrl(url, [3, 5]);
  //     var bankId = ids[0];
  //     var verificationId = ids[1];
  //     expect(url).toEqual('/user/payments/bank/' + bankId + '/verify/' + verificationId);
  //   });
  // });

  // it('should validate first attempt to verify bank account', function(){
  //   verifyBankAccount.verifyAccount(models.bankDetails);

  //   expect(
  //     element(by.css('[ng-show="attemptsRemaining > 0"]')).isDisplayed()
  //   ).toBe(true);

  //   expect(
  //     element(by.css('.message')).getAttribute('name')
  //   ).toEqual('Your bank account has not been verified');
  // });

  // it('should clean form and verify required fields', function(){
  //   verifyBankAccount.clearFormVerifyAccount();

  //   expect(
  //     element(
  //       by.css('[ng-show="verifyBankAccountForm.deposit1.$error.required && submitted"]')
  //     ).isDisplayed()
  //   ).toBe(true);

  //   expect(
  //     element(
  //       by.css('[ng-show="verifyBankAccountForm.deposit2.$error.required && submitted"]')
  //     ).isDisplayed()
  //   ).toBe(true);
  // });

  // it('should validate second attempt to verify bank account', function(){
  //   verifyBankAccount.verifyAccount(models.bankDetails);

  //   expect(
  //     element(by.css('[ng-show="attemptsRemaining > 0"]')).isDisplayed()
  //   ).toBe(true);

  //   expect(
  //     element(by.css('.message')).getAttribute('name')
  //   ).toEqual('Your bank account has not been verified');

  //   verifyBankAccount.clearFormVerifyAccount();
  // });

  // it('should validate third attempt to verify bank account', function(){
  //   verifyBankAccount.verifyAccount(models.bankDetails);

  //   expect(
  //     element(by.css('.message')).getAttribute('name')
  //   ).toEqual('Has exceeded number max to attempts');

  //   expect(browser.getLocationAbsUrl()).toEqual('/user/payments');
  // });
  
  // it('should remove bank account with failed status', function() {
  //   var bankAccounts = element.all(by.repeater('account in bankAccounts'));
  //   expect(bankAccounts.count()).toEqual(1);

  //   expect(
  //     bankAccounts.get(0).
  //     element(by.css('[ng-show="account.state === \'failed\'"]')).isDisplayed()
  //   ).toBe(true);
  //   bankAccounts.get(0).element(by.css('.remove-bank')).click();

  //   expect(
  //     element(by.css('.message')).getAttribute('name')
  //   ).toEqual('The bank account has been removed successfully');

  //   expect(bankAccounts.count()).toEqual(0);
  //   var alert = element.all(by.repeater('alert in alerts'));
  //   expect(alert.count()).toEqual(1);
  // });
  
  it('should sign out', function(){
    user.signOut();
  });

});