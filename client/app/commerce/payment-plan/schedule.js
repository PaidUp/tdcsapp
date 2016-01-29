'use strict';

angular.module('convenienceApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('schedule-list', {
        url: '/commerce/paymentplan/schedule',
        templateUrl: 'app/commerce/payment-plan/schedule/search.html',
        controller: 'ScheduleCtrl',
        auth: true,
        data:{
          roles:['user', 'admin']
        }
      });
  });
