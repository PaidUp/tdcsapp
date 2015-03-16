'use strict';

var signuppo = require('../page_objects/signup.po.js');

exports.signupUserEmail = function(userModel) {

  signuppo.openSignupModal();

  signuppo.fillFormByEmail(userModel);

  element(by.css('#submit-email-login')).click();
  browser.waitForAngular();

  expect(browser.getLocationAbsUrl()).toEqual('/athletes/dashboard');

  element(by.css('.verify-email-modal .close')).click();

  expect(
    element(by.css('.dropdown > .dropdown-toggle')).getText()
  ).toEqual(userModel.firstname+' '+userModel.lastname);

  var alert = element.all(by.repeater('alert in alerts'));
  expect(
    alert.get(0).getText()
  ).toEqual('You have not verified your account yet, Didn\'t get account confirmation email? Resend');
};

exports.signOut = function(){

  element(by.css('.dropdown')).click();
  var signoutLink = element(by.id('signout'));
  expect(signoutLink.getText()).toEqual('Sign Out');
  signoutLink.click();

  expect(element(by.css('#signup')).getText()).toEqual('Sign up');
};