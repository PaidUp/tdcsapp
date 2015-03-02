'use strict';

angular.module('convenienceApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('terms-of-service', {
        url: '/terms-of-service',
        templateUrl: 'app/application/termsOfService/termsOfService.html'
      });
  });