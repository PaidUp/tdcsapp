'use strict';

var Utils = require('../utils/utils');
var Async = require('async');

var selectTeamForAthlete = function () {

  this.fillFormOptions = function() {
    element.all( by.repeater('(indexCustomOp, customOption) in team.attributes.customOptions') ).count().then(function (numCustomOptions) {
      Async.times(numCustomOptions, function (i, callback) {
        ( function (select, radio) {
          element(by.id(select)).isPresent().then(function (isPresent) {
            if (isPresent) {
              // element(by.id(select)).all(by.options('option as option.title for option in customOption.values track by option.valueId')).count().then(function (count) {
              //   var selection = Math.ceil(Math.random() * count);
              //   if (selection === 1) { selection++; }
              //   element(by.id(select)).
              //     element(by.css('option:nth-child('+selection+')')).click();
              //   callback();
              // });
              var selectAthlete = element(by.id(select)).all(by.options('option as option.title for option in customOption.values track by option.valueId'));
              Utils.selectItem(selectAthlete, { chopFirst: true }).then(function (athlete) {
                athlete.click();
                callback();
              });
              // console.log(select);
            } else {
              element(by.id(radio)).isPresent().then(function (isPresent) {
                if (isPresent) {
                  element(by.id(radio)).all( by.repeater('(indexRadioOp, item) in customOption.values') ).count().then(function (count) {
                    var selection = Math.floor(Math.random() * count);
                    element(by.id(radio)).element(by.id('radio'+selection)).click();
                    callback();
                  });
                  // console.log(radio);
                }
              });
            }
          });
        }('select'+i, 'radio'+i) );
      },
      function () {
        element(by.css('form[name=teamSelectionForm]')).submit();
        browser.getLocationAbsUrl().then(function (url) {
          expect(url).toEqual('/commerce/cart/index');
          expect(browser.manage().getCookie('cartId')).toBeDefined();
          expect(browser.manage().getCookie('userId')).toBeDefined();
          element(by.id('proceed-to-checkout')).click();
          browser.getLocationAbsUrl().then(function (url) {
            expect(url).toEqual('/payment/loan');
          });
        });
      });
    });
  };
};

module.exports = new selectTeamForAthlete();
