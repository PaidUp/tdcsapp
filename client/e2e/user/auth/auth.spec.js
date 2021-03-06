'use strict';

var Utils = require('../../utils/utils');
var models = require('../../models');
var user = require('../../user/user.helper.spec.js');

describe('Auth Workflow', function () {

  beforeEach(function () {});

  it("redirect to athletes dashboard", function () {
    browser.get('/');
    user.signupUserEmail(models.signup);
    browser.getLocationAbsUrl().then(function (url) {
        expect(url).toEqual('/athletes/dashboard');
    });
  });
});