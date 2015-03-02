'use strict';

angular.module('convenienceApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('credit-report-authorization', {
        url: '/credit-report-authorization',
        templateUrl: 'app/application/credit_report_pull_auth/credit_report_pull_auth.html'
      });
  });