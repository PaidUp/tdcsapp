'use strict';

var models = require('../../models');
var Utils = require('../../utils/utils');
var signuppo = require('../../page-objects/signup.po.js');
var verifyBankAccount = require('../../page-objects/verify-bank-account.po');
var user = require('../user.helper.spec.js');
var payments = require('./payments.helper.spec.js');

describe('Verify Bank Account Workflow', function() {

	beforeEach(function() {});

	it('should be signed in', function() {
    user.signupUserEmail(models.signup);
	});

	it('should have a bank account', function() {
		payments.goToPayment();
		payments.createNewBankAccount(models.bankDetails);
	});

	it('should validate first failed attempt to verify bank account', function(){

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