'use strict';

var Utils = require('../utils/utils');
var athlete = require('../page-objects/athletes.po.js');

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
  expect($('[ng-show="!athlete.team"]').getText()).toEqual('Santiago doesn\'t have team yet');
};

exports.selectAthlete = function () {
  element(by.css('.my-athletes')).click();
  expect(browser.getLocationAbsUrl()).toEqual('/athletes/dashboard');
  expect(element.all(by.repeater('athlete in athletes')).count()).toBeGreaterThan(0);
  element.all(by.repeater('athlete in athletes')).get(0).click();
  browser.waitForAngular();
};

// exports.selectTeam = function (teamName) {
//   browser.getLocationAbsUrl().then(function (url) {
//     var athleteId = Utils.getIdFromURL(url);
//     expect(url).toEqual('/athletes/slider/'+athleteId);
    
//     browser.wait(function () {
//       return element(by.css('.container.teams')).isDisplayed();
//     }, 10000);
    
//     expect(element.all(by.repeater('team in teams')).count()).toBeGreaterThan(0);
//     var team = element(by.cssContainingText('.team-name', teamName));
//     expect(team).toBeDefined();
//     team.click();
//     browser.waitForAngular();
//   }
// }

