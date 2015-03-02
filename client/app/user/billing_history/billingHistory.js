'use strict';

angular.module('convenienceApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('user-billing-history', {
        url: '/user/billing-history',
        templateUrl: 'app/user/billing_history/billing_history.html',
        controller: 'BillingHistoryCtrl',
        auth: true
      });
  });