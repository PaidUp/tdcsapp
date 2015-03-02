'use strict';

var models = require('../../models');
var Utils = require('../../utils/utils');
var Async = require('async');
var signuppo = require('../../page_objects/signup.po.js');
var loanPayment = require('../../page_objects/loanPayment.po');
var loanApply = require('../../page_objects/apply.po');
var signContract = require('../../page_objects/signContract.po');
var verifyBankAccount = require('../../page_objects/verifyBankAccount.po');
var addAthlete = require('../../page_objects/add-athlete.po.js');
var selectTeamForAthlete = require('../../page_objects/selectTeamForAthlete.po');

describe('Verify Bank Account Workflow', function() {

	beforeEach(function() {});

	it('should be signed in', function() {
		signuppo.openSignupModal();

    var signupModel = models.signup;
    signuppo.fillFormByEmail(signupModel);

    element(by.css('#submit-email-login')).click();
    browser.waitForAngular();
    element(by.css('.verify-email-modal .close')).click();
	});

	it('should have a bank account', function() {
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

        var newBankAccount = element(by.css('.new-bank-account > a'));
        expect(newBankAccount.getText()).toEqual('LINK NEW ACCOUNT');
        newBankAccount.click();

        browser.getLocationAbsUrl().then(function (url) {
        	expect(url).toEqual('/user/bank/account/create');

        	loanPayment.fillForm(models.bankDetails);
        	element(by.id('payment-btn')).click();

        	browser.wait(function () {
			      return browser.isElementPresent(element(by.css('.new-bank-account > a')));
			    }, 15000);

        	browser.getLocationAbsUrl().then(function (url) {
        		expect(url).toEqual('/user/payments');
        	});
        });
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