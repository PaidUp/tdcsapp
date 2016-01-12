'use strict';

angular.module('convenienceApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('schedule-list', {
        url: '/commerce/paymentplan/list',
        templateUrl: 'app/commerce/schedule/list/list.html',
        controller: 'ScheduleListCtrl',
        auth: true,
        data:{
          roles:['user', 'admin']
        }
      });
  });