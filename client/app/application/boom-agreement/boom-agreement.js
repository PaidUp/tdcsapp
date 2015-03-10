'use strict';

angular.module('convenienceApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('boom-agreement', {
        url: '/boom-agreement',
        templateUrl: 'app/application/boom-agreement/boom-agreement.html'
      });
  });