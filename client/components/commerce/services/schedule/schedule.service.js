'use strict';

angular.module('convenienceApp')
  .service('scheduleService', function ($cookieStore, $q, $resource, $rootScope) {
    var ScheduleInfo = $resource('/api/v1/commerce/schedule/info/:action/:id', {}, {});
    var Schedule = $resource('/api/v1/commerce/schedule/:action', {}, {});

    this.scheduleList = function(scheduleFilter){
      return Schedule.save({action: 'list'},{scheduleFilter}).$promise;
    }

    this.scheduleInfoFull = function(paymentPlanId){
        return ScheduleInfo.get({action: 'full',id: paymentPlanId}).$promise;
    }

  });