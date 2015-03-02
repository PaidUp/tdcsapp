'use strict';

angular.module('convenienceApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('terms-of-service', {
        url: '/terms-of-service',
        templateUrl: 'app/application/terms_of_service/terms_of_service.html'
      });
  });