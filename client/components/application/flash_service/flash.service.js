'use strict';

angular.module('convenienceApp')
  .service('FlashService', function ($rootScope) {
    var messages = [];

    this.addAlert = function(alert) {
      messages.push(alert);
      $rootScope.$broadcast('event:alerts');
    };

    this.shift = function() {
      return messages.splice(0,1)[0];
    };
  });