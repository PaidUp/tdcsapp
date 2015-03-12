'use strict';

var models = require('../models');
var Utils = require('../utils/utils');
var signuppo = require('../page_objects/signup.po.js');
var user = require('../user/user.helper.spec.js');
// var payments = require('./payments.helper.spec.js');

describe('TDCore', function() {

	beforeEach(function() {});

  it('should be signed in', function() {
    user.signupUserEmail(models.signup);
  });

  it('should sign out', function(){
    user.signOut();
  });

});
