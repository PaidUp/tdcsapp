'use strict';

angular.module('convenienceApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('user-billing-history', {
        url: '/user/billing-history',
        templateUrl: 'app/user/billing-history/billing-history.html',
        controller: 'BillingHistoryCtrl',
        auth: true,
        data:{
          roles:['user', 'coach']
        }
      });
  });