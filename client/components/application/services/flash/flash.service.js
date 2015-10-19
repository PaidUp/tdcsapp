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

    this.overrideByAlias = function(alias, alert){
      var remove = false;
      var pos = 0;
      $rootScope.alerts.forEach(function(ele, idx, arr){
        console.log('ele', ele);
        if(ele.alias && ele.alias == alias){
          remove = true;
          pos = idx;
        }
      });
      $rootScope.alerts.splice(pos,1);
      this.addAlert(alert);
    }
  });
