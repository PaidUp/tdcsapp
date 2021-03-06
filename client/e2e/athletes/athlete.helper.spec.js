'use strict';

var Utils = require('../utils/utils');
var athlete = require('../page-objects/athletes.po.js');
var creditCardPayment = require('../page-objects/credit-card-payment.po');
var driver = browser.driver;

exports.addAthlete = function (athleteModel) {
	element(by.css('button#add-athlete-btn')).click();
  browser.waitForAngular();

  athlete.fillFormNewAthlete(athleteModel);

  expect(athlete.name).toEqual(athleteModel.firstName);
  expect(athlete.lastName).toEqual(athleteModel.lastName);
  expect(athlete.gender).toEqual(athleteModel.gender);
  expect(athlete.month).toEqual(athleteModel.date.month);
  expect(athlete.day).toEqual(athleteModel.date.day);
  expect(athlete.year).toEqual(athleteModel.date.year);

  element(by.css('button[type=submit]')).click();
  expect(element(by.css('button#add-athlete-btn')).isDisplayed()).toBeFalsy();
  expect(element.all(by.repeater('athlete in athletes')).count()).toEqual(1);
  expect($('[ng-show="!athlete.team"]').getText()).toEqual('Choose a team for this athlete');
};

exports.selectAthlete = function () {
  element(by.css('.my-athletes')).click();
  expect(browser.getLocationAbsUrl()).toEqual('/athletes/dashboard');
  expect(element.all(by.repeater('athlete in athletes')).count()).toBeGreaterThan(0);
  element.all(by.repeater('athlete in athletes')).get(0).click();
  browser.waitForAngular();
};

exports.selectTeam = function (teamName) {
  browser.getLocationAbsUrl().then(function (url) {
    var athleteId = Utils.getIdFromURL(url);
    expect(url).toEqual('/athletes/slider/'+athleteId);

    browser.wait(function () {
      return element(by.css('.container.teams')).isDisplayed();
    }, 10000);

    expect(element.all(by.repeater('team in teams')).count()).toBeGreaterThan(0);
    var team = element(by.cssContainingText('.team-name', teamName));
    expect(team).toBeDefined();
    team.click();
    browser.waitForAngular();

    browser.getLocationAbsUrl().then(function (url) {
      var ids = Utils.getIdsfromUrl(url, [2, 4]);
      var teamId = ids[0];
      expect(athleteId).toEqual(ids[1]);
      expect(url).toEqual('/teams/profile/' + teamId + '/athlete/' + athleteId);
    });
  });
};

exports.selectSingleTeam = function(){

  driver.wait(function() {
    return element(by.id('selectTeam')).all(by.tagName('option')).count().then(function(count) {
      if(count > 0){
        var mySelect = element(by.id('selectTeam'));
        Utils.selectDropdownByNumber(mySelect, 1);
        return true;
      }
      return false;
    });
  }, 50000).then(function(obj){
    expect(element(by.id('selectTeam')).getAttribute('value')).toEqual('0');

  });
};

exports.payNow = function(){
  var buttonPay = element(by.css('.btnSignUp'));
  buttonPay.getAttribute('type').then(function(text) {
    expect(text).toEqual('submit');
    buttonPay.click();
    expect(element.all(by.repeater('team in teams')).count()).toEqual(1);
  });
};

exports.checkOut = function() {
  var buttonCheckOut = element(by.css('.btnSignUp'));
  buttonCheckOut.getAttribute('type').then(function (text) {
    expect(text).toEqual('button');
    buttonCheckOut.click();


    driver.wait(function() {
      return element.all(by.repeater('schedule in schedules')).count().then(function(count) {
        if(count > 0){
          return true;
        }
        return false;
      });
    }, 50000);
  });
};

exports.paymentCreditCard = function(model){
  element.all(by.repeater('tab in tabs')).then(function(elements) {
    expect(elements[0].getText()).toEqual('Credit Card');

    creditCardPayment.fillForm(model);

    element(by.css('.btnSignUp')).click();

    driver.wait(function() {
      return element(by.css('.titleThankyouBanner')).isPresent();

    }, 50000).then(function(){
      element(by.css('.titleThankyouBanner')).getText().then(function(txt){
        expect(txt).toEqual('Thanks for your order!');
      });
    });
  });


};
