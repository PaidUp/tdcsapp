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
      var aliasExist = false;
      $rootScope.alerts.forEach(function(ele, idx, arr){
        console.log('ele', ele);
        if(ele.alias && ele.alias == alias){
          aliasExist = true;
          arr[idx] = alert;
        }
      });
      if(!aliasExist){
        messages.push(alert);
      }
      $rootScope.$broadcast('event:alerts');
    }
  });
