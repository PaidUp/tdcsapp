'use strict';

angular.module('convenienceApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('main', {
        url: '/',
        templateUrl: 'app/application/main/main.html'
      }).state('faq', {
        url: '/faq',
        templateUrl: 'app/application/main/faq.html',
        controller : 'FaqCtrl'
      });
  });
