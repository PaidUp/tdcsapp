'use strict';

var models = require('../../models');
var Utils = require('../../utils/utils');
var signuppo = require('../../page_objects/signup.po.js');
var user = require('../user/user.helper.spec.js');
var addAthlete = require('../page_objects/add-athlete.po.js');

describe('Add address', function() {

  beforeEach(function() {});

  it('should be signed in', function() {
    user.signupUserEmail(models.signup);
  });

  it('add address', function() {
    element(by.css('.dropdown')).click();
    var ProfileLink = element(by.css('.dropdown .dropdown-menu')).element(by.css('li > a'));
    expect(ProfileLink.getText()).toEqual('Profile');
    ProfileLink.click();

    browser.getLocationAbsUrl().then(function (url) {
      expect(url).toEqual('/user/account');
    });
  });

  it('should sign out', function(){
    user.signOut();
  });

});