'use strict';

var Utils = require('../utils/utils');
var Async = require('async');

var team = function () {

  this.fillFormTeamForAthlete = function() {
    element.all(
      by.repeater('(indexCustomOp, customOption) in team.attributes.customOptions') 
    ).count().then(function (numCustomOptions) {
      Async.times(numCustomOptions, function (i, callback) {( 
        function (select, radio) {
          element(by.id(select)).isPresent().then(function (isPresent) {
            if (isPresent) {
              var selectAthlete = element(by.id(select)).all(by.options(
                'option as option.title for option in 
                 customOption.values track by option.valueId'
              ));
              Utils.selectItem(selectAthlete, { chopFirst: true }).then(function (athlete) {
                athlete.click();
                callback();
              });
            } else {
              element(by.id(radio)).isPresent().then(function (isPresent) {
                if (isPresent) {
                  element(by.id(radio)).all( 
                    by.repeater('(indexRadioOp, item) in customOption.values') 
                  ).count().then(function (count) {
                    var selection = Math.floor(Math.random() * count);
                    element(by.id(radio)).element(by.id('radio'+selection)).click();
                    callback();
                  });
                }
              });
            }
          });
        }('select'+i, 'radio'+i));
      },
      function () {
        element(by.css('form[name=teamSelectionForm]')).submit();
      });
    });
  };

};

module.exports = new team();