'use strict';

var Utils = require('../../utils/utils');
var models = require('../../models');
var user = require('../../user/user.helper.spec.js');

describe('Auth Workflow (parent)', function () {

  beforeEach(function () {});

  it("Auth parent", function () {
    browser.get('/commerce/provider/landing');
    //TODO: test available options to parent.
    user.signupUserEmail(models.signup);
    browser.getLocationAbsUrl().then(function (url) {
        expect(url).toEqual('/athletes/dashboard');
    });
  });
});
//browser.get(urlString);