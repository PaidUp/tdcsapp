'use strict';

angular.module('convenienceApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('provider-request', {
        url: '/commerce/provider/request',
        templateUrl: 'app/commerce/provider/request/request.html',
        controller: 'ProviderRequestCtrl',
        auth: true
      }).state('provider-landing', {
        url: '/commerce/provider/landing',
        templateUrl: 'app/commerce/provider/landing/landing.html',
        controller: 'ProviderLandingCtrl',
        auth: false
      });
  });