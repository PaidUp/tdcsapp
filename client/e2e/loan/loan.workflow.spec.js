'use strict';

var Utils = require('../utils/utils');
var models = require('../models');
var user = require('../user/user.helper.spec.js');
var athlete = require('../athletes/athlete.helper.spec.js');
var teamspo = require('../page-objects/teams.po');
var loanpo = require('../page-objects/loan.po');
var payments = require('../user/payments/payments.helper.spec.js');
var verifyBankAccount = require('../page-objects/verify-bank-account.po');

describe.skip('Loan Workflow', function () {

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

  it('should have a bank account', function() {
    payments.goToPayment();
    var bankAccounts = element.all(by.repeater('account in bankAccounts'));
    expect(bankAccounts.count()).toEqual(1);
  });

  it('should validate first failed attempt to verify bank account', function(){
    var bankAccounts = element.all(by.repeater('account in bankAccounts'));
    expect(bankAccounts.count()).toEqual(1);
    expect(
      bankAccounts.get(0).
      element(by.css('[ng-show="account.state === \'pending\'"]')).isDisplayed()
    ).toBe(true);

    bankAccounts.get(0).element(by.css('.verify-bank')).click();

    browser.getLocationAbsUrl().then(function (url) {
      var ids = Utils.getIdsfromUrl(url, [3, 5]);
      var bankId = ids[0];
      var verificationId = ids[1];
      expect(url).toEqual('/user/payments/bank/' + bankId + '/verify/' + verificationId);

      verifyBankAccount.verifyAccount(
        models.bankDetails.valueVerifyAccountError, 
        models.bankDetails.valueVerifyAccountError
      );

      expect(
        element(by.css('[ng-show="attemptsRemaining > 0"]')).isDisplayed()
      ).toBe(true);

      expect(
        element(by.css('[ng-show="attemptsRemaining > 0"]')).getText()
      ).toEqual('Remaining attempts: 2');

      expect(
        element(by.css('.message')).getAttribute('name')
      ).toEqual('Your bank account has not been verified');
    });
  });

  it('should validate second failed attempt to verify bank account', function(){

    payments.goToPayment();

    var bankAccounts = element.all(by.repeater('account in bankAccounts'));
    expect(bankAccounts.count()).toEqual(1);
    expect(
      bankAccounts.get(0).
      element(by.css('[ng-show="account.state === \'pending\'"]')).isDisplayed()
    ).toBe(true);

    bankAccounts.get(0).element(by.css('.verify-bank')).click();

    browser.getLocationAbsUrl().then(function (url) {
      var ids = Utils.getIdsfromUrl(url, [3, 5]);
      var bankId = ids[0];
      var verificationId = ids[1];
      expect(url).toEqual('/user/payments/bank/' + bankId + '/verify/' + verificationId);

      expect(
        element(by.css('[ng-show="attemptsRemaining > 0"]')).isDisplayed()
      ).toBe(true);

      expect(
        element(by.css('[ng-show="attemptsRemaining > 0"]')).getText()
      ).toEqual('Remaining attempts: 2');

      verifyBankAccount.verifyAccount(
        models.bankDetails.valueVerifyAccountError, 
        models.bankDetails.valueVerifyAccountError
      );

      expect(
        element(by.css('.message')).getAttribute('name')
      ).toEqual('Your bank account has not been verified');
    });
  });

  it('should validate third failed attempt to verify bank account', function(){

    payments.goToPayment();

    var bankAccounts = element.all(by.repeater('account in bankAccounts'));
    expect(bankAccounts.count()).toEqual(1);
    expect(
      bankAccounts.get(0).
      element(by.css('[ng-show="account.state === \'pending\'"]')).isDisplayed()
    ).toBe(true);

    bankAccounts.get(0).element(by.css('.verify-bank')).click();

    browser.getLocationAbsUrl().then(function (url) {
      var ids = Utils.getIdsfromUrl(url, [3, 5]);
      var bankId = ids[0];
      var verificationId = ids[1];
      expect(url).toEqual('/user/payments/bank/' + bankId + '/verify/' + verificationId);

      expect(
        element(by.css('[ng-show="attemptsRemaining > 0"]')).isDisplayed()
      ).toBe(true);

      expect(
        element(by.css('[ng-show="attemptsRemaining > 0"]')).getText()
      ).toEqual('Remaining attempts: 1');

      verifyBankAccount.verifyAccount(
        models.bankDetails.valueVerifyAccountError, 
        models.bankDetails.valueVerifyAccountError
      );

      expect(
        element(by.css('.message')).getAttribute('name')
      ).toEqual('You have exceeded the max number of attempts');
    });
  });

  it('should remove bank account with failed status', function() {

    payments.goToPayment();

    var bankAccounts = element.all(by.repeater('account in bankAccounts'));
    expect(bankAccounts.count()).toEqual(1);
    expect(
      bankAccounts.get(0).
      element(by.css('[ng-show="account.state === \'failed\'"]')).isDisplayed()
    ).toBe(true);

    bankAccounts.get(0).element(by.css('.remove-bank')).click();

    expect(
      element(by.css('.message')).getAttribute('name')
    ).toEqual('The bank account has been removed successfully');

    expect(bankAccounts.count()).toEqual(0);
    var alert = element.all(by.repeater('alert in alerts'));
    expect(alert.count()).toEqual(1);
  });

  it('should verify bank account with pending status successfully', function() {

    payments.goToPayment();
    payments.createNewBankAccount(models.bankDetails);

    var bankAccounts = element.all(by.repeater('account in bankAccounts'));
    expect(bankAccounts.count()).toEqual(1);
    expect(
      bankAccounts.get(0).
      element(by.css('[ng-show="account.state === \'pending\'"]')).isDisplayed()
    ).toBe(true);

    bankAccounts.get(0).element(by.css('.verify-bank')).click();
    
    browser.getLocationAbsUrl().then(function (url) {
      var ids = Utils.getIdsfromUrl(url, [3, 5]);
      var bankId = ids[0];
      var verificationId = ids[1];
      expect(url).toEqual('/user/payments/bank/' + bankId + '/verify/' + verificationId);

      verifyBankAccount.verifyAccount(
        models.bankDetails.valueVerifyAccount, 
        models.bankDetails.valueVerifyAccount
      );
        
      expect(browser.getLocationAbsUrl()).toEqual('/athletes/dashboard');
      payments.goToPayment();

      var bankAccounts = element.all(by.repeater('account in bankAccounts'));
      expect(bankAccounts.count()).toEqual(1);
      expect(
        bankAccounts.get(0).
        element(by.css('[ng-show="account.state === \'pending\'"]')).isDisplayed()
      ).toBe(false);
     
    });
  });
  
  it('should sign out', function(){
    user.signOut();
  });

});