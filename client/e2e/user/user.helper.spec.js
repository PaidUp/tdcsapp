'use strict';

var signuppo = require('../page-objects/signup.po.js');

exports.signupUserEmail = function(userModel,dest) {
  signuppo.openSignupModal();
  signuppo.fillFormByEmail(userModel);

  expect(signuppo.name).toEqual(userModel.firstname);
  expect(signuppo.lastName).toEqual(userModel.lastname);
  expect(signuppo.email).toEqual(userModel.fakeEmail);
  expect(signuppo.password).toEqual(userModel.pass);
  expect(signuppo.passwordConfirmation).toEqual(userModel.pass);

  element(by.css('#submit-email-login')).click();
  browser.waitForAngular();
  expect(browser.getLocationAbsUrl()).toEqual('/athletes/dashboard');

  element(by.css('.verify-email-modal .close')).click();

  var addAthleteBtn = element(by.css('button#add-athlete-btn'));
  expect(addAthleteBtn.getAttribute('innerText')).toEqual('Add Athlete');

  expect(browser.manage().getCookie('token')).toBeDefined();
  expect(
    element(by.css('.dropdown > .dropdown-toggle')).getText()
  ).toEqual(userModel.firstname+' '+userModel.lastname);

  var alert = element.all(by.repeater('alert in alerts'));
  expect(
    alert.get(0).getText()
  ).toEqual('You have not verified your account yet, Didn\'t get account confirmation email? Resend');
};

exports.signupCoachEmail = function(userModel,dest) {
  signuppo.openSignupModal();
  element(by.css('#IamCoach')).click();
  signuppo.fillFormByEmail(userModel);

  expect(signuppo.name).toEqual(userModel.firstname);
  expect(signuppo.lastName).toEqual(userModel.lastname);
  expect(signuppo.email).toEqual(userModel.fakeEmail);
  expect(signuppo.password).toEqual(userModel.pass);
  expect(signuppo.passwordConfirmation).toEqual(userModel.pass);

  element(by.css('#submit-email-login')).click();
  browser.waitForAngular();
  element(by.css('.verify-email-modal .close')).click();
};

exports.signOut = function(){

  element(by.css('.dropdown')).click();
  var signoutLink = element(by.id('signout'));
  expect(signoutLink.getText()).toEqual('Sign Out');
  signoutLink.click();

  expect(element(by.css('#signup')).getText()).toEqual('Sign up');
};