'use strict';

var Utils = require('../../utils/utils');
var models = require('../../models');
var user = require('../../user/user.helper.spec.js');

describe('Auth Workflow', function () {

  beforeEach(function () {});

  it("redirect to provider request", function () {
    //TODO redirect to /commerce/provider/landing
    browser.get('/commerce/provider/landing');
    
    user.signupUserEmail(models.signup);
    browser.getLocationAbsUrl().then(function (url) {
        console.log('url:',url);
        expect(url).toEqual('/commerce/provider/request');
    });

  });

});
//browser.get(urlString);