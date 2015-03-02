'use strict';

angular.module('convenienceApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('boom-agreement', {
        url: '/boom-agreement',
        templateUrl: 'app/application/boom_agreement/boom_agreement.html'
      });
  });