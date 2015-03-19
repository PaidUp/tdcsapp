'use strict';

var signUp = function () {

  this.openSignupModal = function () {
    element(by.css('#signup')).click();
    element(by.css('#sign-up-email')).click();
  };

  this.fillFormByEmail = function(userModel) {
    this.pass = userModel.pass;
    this.fakeEmail = userModel.fakeEmail;

    element(by.model('user.firstName')).sendKeys(userModel.firstname);
    element(by.model('user.lastName')).sendKeys(userModel.lastname);
    element(by.model('user.email')).sendKeys(this.fakeEmail);
    element(by.model('password')).sendKeys(this.pass);
    element(by.css('form[name=form] input[name=confirm]')).sendKeys(this.pass);

    this.name = element(by.model('user.firstName')).getAttribute('value');
    this.lastName = element(by.model('user.lastName')).getAttribute('value');
    this.email = element(by.model('user.email')).getAttribute('value');
    this.password = element(by.model('password')).getAttribute('value');
    this.passwordConfirmation = element(by.css('form[name=form] input[name=confirm]')).getAttribute('value');
  };
};

module.exports = new signUp();
