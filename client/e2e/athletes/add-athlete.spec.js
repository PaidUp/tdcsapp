'use strict';

var models = require('../models');
var Utils = require('../utils/utils');
var signuppo = require('../page-objects/signup.po.js');
var user = require('../user/user.helper.spec.js');
var credentials = require('../page-objects/credentials.po.js');
var addAthlete = require('../page-objects/athletes.po.js');
var athleteHelper = require('./athlete.helper.spec');
var payments = require('../user/payments/payments.helper.spec.js');


describe('add athlete', function() {

  beforeEach(function() {});

  it('add child', function() {

    athleteHelper.addAthlete(models.athlete);

  });

  it('select athlete' , function(){
    athleteHelper.selectAthlete();
  });

  it('add team to athlete', function() {

    athleteHelper.selectTeam(models.teamName);

  });

  it('select single team', function() {

    athleteHelper.selectSingleTeam();

  });

  it('pay now', function() {

    athleteHelper.payNow();

  });

  it('check out', function() {

    athleteHelper.checkOut();

  });
/*
  it.skip('change password', function() {
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
*/
  // it('go to payments', function() {
  //   payments.goToPayment();
  // });
/*
  it.skip('sign out', function(){
    user.signOut();
  });
  */
});
