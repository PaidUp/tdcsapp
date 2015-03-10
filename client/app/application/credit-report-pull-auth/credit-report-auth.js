'use strict';

angular.module('convenienceApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('credit-report-authorization', {
        url: '/credit-report-authorization',
        templateUrl: 'app/application/credit-report-pull-auth/credit-report-pull-auth.html'
      });
  });