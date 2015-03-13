'use strict';

var models = require('../models');
var Utils = require('../utils/utils');
var signuppo = require('../page_objects/signup.po.js');
var user = require('../user/user.helper.spec.js');
var addAthlete = require('../page_objects/add-athlete.po.js');
// var payments = require('./payments.helper.spec.js');

describe('TDCore', function() {

	beforeEach(function() {});

  it('should be signed in', function() {
    user.signupUserEmail(models.signup);
  });

  it("should register a child", function() {
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


  it('should sign out', function(){
    user.signOut();
  });

});
