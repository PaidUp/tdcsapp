'use strict';

angular.module('convenienceApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('main', {
        url: '/',
        templateUrl: 'app/application/main/main.html',
        test:'true',
        data:{
          roles:['user','guest']
        }
      }).state('faq', {
        url: '/faq',
        templateUrl: 'app/application/main/faq.html',
        controller : 'FaqCtrl'
      });
  });
