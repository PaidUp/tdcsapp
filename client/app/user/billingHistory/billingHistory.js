'use strict';

angular.module('convenienceApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('user-billing-history', {
        url: '/user/billing-history',
        templateUrl: 'app/user/billingHistory/billingHistory.html',
        controller: 'BillingHistoryCtrl',
        auth: true
      });
  });