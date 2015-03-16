'use strict';

angular.module('convenienceApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('credits', {
        url: '/credits',
        templateUrl: 'app/application/credits/credits.html'
      });
  });