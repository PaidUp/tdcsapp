'use strict';

var models = require('../models');
var Utils = require('../utils/utils');
var signuppo = require('../page_objects/signup.po.js');
var user = require('../user/user.helper.spec.js');
var credentials = require('../page_objects/credentials.po.js');
var addAthlete = require('../page_objects/add-athlete.po.js');
var payments = require('../user/payments/payments.helper.spec.js');

describe('Convenience Select test flow', function() {

  beforeEach(function() {});

  it('sign up', function() {
    user.signupUserEmail(models.signup);
  });

  it('add credentials', function() {
    element(by.css('.dropdown')).click();
    var ProfileLink = element(by.css('.dropdown .dropdown-menu')).element(by.css('li > a'));

    expect(ProfileLink.getText()).toEqual('Profile');
    ProfileLink.click();

    browser.getLocationAbsUrl().then(function (url) {
      expect(url).toEqual('/user/account');

      credentials.fillFormContact(models.userCredentials);
      element(by.css('.btnSignUp')).click();

      var credentialsModel = models.userCredentials;
      expect(credentials.phone).toEqual(credentialsModel.phone);

      expect(credentials.address1).toEqual(credentialsModel.address.address1);
      expect(credentials.address2).toEqual(credentialsModel.address.address2);
      expect(credentials.city).toEqual(credentialsModel.address.city);

    });
  });

  it('add child', function() {
    element(by.css('.my-athletes')).click();

    browser.getLocationAbsUrl().then(function (url) {
      expect(url).toEqual('/athletes/dashboard');

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
  });

  it('change password', function() {
    element(by.css('.dropdown')).click();
    var ProfileLink = element(by.css('.dropdown .dropdown-menu')).element(by.css('li > a'));

    expect(ProfileLink.getText()).toEqual('Profile');
    ProfileLink.click();

    browser.getLocationAbsUrl().then(function (url) {
      expect(url).toEqual('/user/account');

      var signuppo = models.signup.pass;
      var userCredential = models.userCredentials;
      credentials.fillFormPassword(signuppo.pass, userCredential.newPass);
      element(by.css('.btnSignUp')).click();

    });
  });

  // it('go to payments', function() {
  //   payments.goToPayment();
  // });

  it('sign out', function(){
    user.signOut();
  });
});