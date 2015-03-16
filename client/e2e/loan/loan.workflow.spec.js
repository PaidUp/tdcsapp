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
var verifyBankAccount = require('../page_objects/verifyBankAccount.po');

describe('Loan Workflow', function() {

  beforeEach(function() {});

  it("should be signed in", function() {
    // browser.get('/');
    expect(element(by.css('#signup')).getText()).toMatch('Sign up');
    signuppo.openSignupModal();

    var signupModel = models.signup;
    signuppo.fillFormByEmail(signupModel);

    expect(signuppo.name).toEqual(signupModel.firstname);
    expect(signuppo.lastName).toEqual(signupModel.lastname);
    expect(signuppo.email).toEqual(signupModel.fakeEmail);
    expect(signuppo.password).toEqual(signupModel.pass);
    expect(signuppo.passwordConfirmation).toEqual(signupModel.pass);

    element(by.css('#submit-email-login')).click();
    browser.waitForAngular();
    expect(browser.getLocationAbsUrl()).toEqual('/athletes/dashboard');
    element(by.css('.verify-email-modal .close')).click();
    var addAthleteBtn = element(by.css('button#add-athlete-btn'));
    // in protractor we can only work with visible content
    expect(addAthleteBtn.getAttribute('innerText')).toEqual('Add Athlete');
    expect(browser.manage().getCookie('token')).toBeDefined();
    var alert = element.all(by.repeater('alert in alerts'));
    alert.get(0).getText().then(function (text) {
      expect(text.indexOf('not verified your account yet')).not.toEqual(-1);
    });
  });

  it("should register a child", function() {
    element(by.css('button#add-athlete-btn')).click();
    browser.waitForAngular();

    var athleteModel = models.athlete;

    addAthlete.fillForm(athleteModel);

    expect(addAthlete.name).toEqual(athleteModel.firstName);
    expect(addAthlete.lastName).toEqual(athleteModel.lastName);
    expect(addAthlete.gender).toEqual(athleteModel.gender);
    expect(addAthlete.month).toEqual(athleteModel.date.month);
    expect(addAthlete.day).toEqual(athleteModel.date.day);
    expect(addAthlete.year).toEqual(athleteModel.date.year);

    element(by.css('button[type=submit]')).click();
    expect(element(by.css('button#add-athlete-btn')).isDisplayed()).toBeFalsy();
    expect(element.all(by.repeater('athlete in athletes')).count()).toEqual(1);
    expect($('[ng-show="!athlete.team"]').getText()).toEqual('Santiago doesn\'t have team yet');
  });

  it("should select a team for a selected child", function() {
    element.all(by.repeater('athlete in athletes')).get(0).click();
    browser.waitForAngular();
    browser.getLocationAbsUrl().then(function (url) {
      // console.log(Utils.getIdFromURL(url));
      var athleteId = Utils.getIdFromURL(url);
      expect(url).toEqual('/athletes/slider/'+athleteId);
      browser.wait(function () {
        return element(by.css('.container.teams')).isDisplayed();
      }, 10000);
      expect(element.all(by.repeater('team in teams')).count()).toBeGreaterThan(0);
      var team = element(by.cssContainingText('.team-name', models.teamName));
      expect(team).toBeDefined();
      team.click();
      browser.waitForAngular();
      browser.getLocationAbsUrl().then(function (url) {
        // url -> /teams/profile/:teamId/athlete/:athleteId
        var ids = Utils.getIdsfromUrl(url, [2, 4]);
        var teamId = ids[0];
        expect(athleteId).toEqual(ids[1]);
        expect(url).toEqual('/teams/profile/' + teamId + '/athlete/' + athleteId);

        var athletefirstName = element(by.css('form select#select-athlete')).$('option:checked').getText();
        expect(athletefirstName).toEqual(models.athlete.firstName);
        expect(element(by.binding('team.attributes.name')).getText()).toEqual(models.teamName);

        browser.wait(function () {
          return element(by.css('.magento-custom-options')).isDisplayed();
        }, 10000);
        selectTeamForAthlete.fillFormOptions();
      });
    });
  });

  it("should apply to loan", function() {
    var userLoan = models.userLoan;

    element(by.css('.loan-apply-btn')).click();
    browser.getLocationAbsUrl().then(function (url) {
      expect(url).toEqual('/payment/loan/apply');
      var name = element(by.model('user.firstName')).getAttribute('value');
      var lastName = element(by.model('user.lastName')).getAttribute('value');
      expect(name).toEqual(userLoan.firstname);
      expect(lastName).toEqual(userLoan.lastname);

      loanApply.fillForm(userLoan);

      element(by.css('form[name=loanApplyForm]')).submit();
      // browser.waitForAngular();
      browser.getLocationAbsUrl().then(function (url) {
        expect(url).toEqual('/payment/loan/signcontract');
      });
    });
  });

  it("should sign the loan contract", function() {
    signContract.setData();

    expect(element(by.binding('contractHTML')).getText()).not.toEqual('');
    expect(signContract.loanAmount).not.toEqual('');
    expect(signContract.term).not.toEqual('');
    expect(signContract.apr).not.toEqual('');
    expect(signContract.monthlyPayment).not.toEqual('');

    signContract.fillForm(models.userLoan);

    element(by.css('form[name=signContractForm]')).submit();
    // browser.waitForAngular();
    browser.getLocationAbsUrl().then(function (url) {
      expect(url).toEqual('/payment/loan/payment');
    });
  });

  it("should place a payment", function() {
    loanPayment.setData();

    expect(loanPayment.loanAmount).not.toEqual('');
    expect(loanPayment.term).not.toEqual('');
    expect(loanPayment.apr).not.toEqual('');
    expect(loanPayment.monthlyPayment).not.toEqual('');

    expect(element.all(by.repeater('(index, payment) in paymentSchedule')).count()).toBeGreaterThan(0);

    loanPayment.fillForm(models.bankDetails);

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

  it("should have a bank account", function() {

    // browser.get('/user/payments');
    element(by.css('.dropdown')).click();
    var ProfileLink = element(by.css('.dropdown .dropdown-menu')).element(by.css('li > a'));
    expect(ProfileLink.getText()).toEqual('Profile');
    ProfileLink.click();
    browser.getLocationAbsUrl().then(function (url) {
      expect(url).toEqual('/user/account');
      var tabs = element(by.css('.user-tabs .nav.nav-tabs')).all(by.repeater('tab in tabs'));
      // console.log('TABS:\n');
      // tabs.each(function(tab) {
      //   tab.getWebElement().getInnerHtml().then(function (html) {
      //     console.log(html)
      //   });
      // });
      // 1 is the array index where we can find the User Payment Methods Tab
      expect(tabs.count()).toEqual(3);
      tabs.get(1).click();

      browser.getLocationAbsUrl().then(function (url) {
        expect(url).toEqual('/user/payments');
      });
    });
  });

  it('should verify bank account with pending status', function() {
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
    });
  });

  it('should validate first attempt to verify bank account', function(){
    verifyBankAccount.verifyAccount(models.bankDetails);

    expect(
      element(by.css('[ng-show="attemptsRemaining > 0"]')).isDisplayed()
    ).toBe(true);

    expect(
      element(by.css('.message')).getAttribute('name')
    ).toEqual('Your bank account has not been verified');
  });

  it('should clean form and verify required fields', function(){
    verifyBankAccount.clearFormVerifyAccount();

    expect(
      element(
        by.css('[ng-show="verifyBankAccountForm.deposit1.$error.required && submitted"]')
      ).isDisplayed()
    ).toBe(true);

    expect(
      element(
        by.css('[ng-show="verifyBankAccountForm.deposit2.$error.required && submitted"]')
      ).isDisplayed()
    ).toBe(true);
  });

  it('should validate second attempt to verify bank account', function(){
    verifyBankAccount.verifyAccount(models.bankDetails);

    expect(
      element(by.css('[ng-show="attemptsRemaining > 0"]')).isDisplayed()
    ).toBe(true);

    expect(
      element(by.css('.message')).getAttribute('name')
    ).toEqual('Your bank account has not been verified');

    verifyBankAccount.clearFormVerifyAccount();
  });

  it('should validate third attempt to verify bank account', function(){
    verifyBankAccount.verifyAccount(models.bankDetails);

    expect(
      element(by.css('.message')).getAttribute('name')
    ).toEqual('Has exceeded number max to attempts');

    expect(browser.getLocationAbsUrl()).toEqual('/user/payments');
  });
  
  it('should remove bank account with failed status', function() {
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

});
