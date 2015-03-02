'use strict';

angular.module('convenienceApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('privacy-policy', {
        url: '/privacy-policy',
        templateUrl: 'app/application/privacyPolicy/privacyPolicy.html'
      });
  });