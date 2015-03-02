'use strict';

angular.module('convenienceApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('credit-report-authorization', {
        url: '/credit-report-authorization',
        templateUrl: 'app/application/creditReportPullAuth/creditReportPullAuth.html'
      });
  });