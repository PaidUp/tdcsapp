'use strict';

angular.module('convenienceApp')
  .config(function ($stateProvider) {
    $stateProvider.state('main', {
      url: '/',
      templateUrl: 'app/application/main/main.html',
      test:'true',
      data:{
        roles:['guest']
      }
    }).state('main-pn', {
      url: '/pn/:team',
      templateUrl: 'app/application/main/main.html',
      data:{
        roles:['guest']
      }
    }).state('faq', {
      url: '/faq',
      templateUrl: 'app/application/main/faq.html',
      controller : 'FaqCtrl'
    }).state('maintenance', {
      url: '/maintenance',
      templateUrl: 'app/application/main/maintenance.html',
      controller : 'FaqCtrl'
    }).state('referral-program', {
      url: '/referral-program-terms-and-conditions',
      templateUrl: 'app/application/main/referral-program/referral-program-rules.html',
      controller : 'ReferralProgramCtrl'
    }).state('about-us', {
      url: '/about-us',
      templateUrl: 'app/application/main/about-us.html',
      controller : 'aboutUsCtrl'
    });
  });
