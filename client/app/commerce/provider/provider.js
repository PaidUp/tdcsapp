'use strict';

angular.module('convenienceApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('provider-request', {
        url: '/commerce/provider/request',
        templateUrl: 'app/commerce/provider/request/request.html',
        controller: 'ProviderRequestCtrl',
        auth: true,
        data:{
          roles:['coach']
        }
      }).state('provider-landing', {
        url: '/commerce/provider/landing',
        templateUrl: 'app/commerce/provider/landing/landing.html',
        controller: 'ProviderLandingCtrl',
        auth: false
      }).state('provider-success', {
        url: '/commerce/provider/success',
        templateUrl: 'app/commerce/provider/success/success.html',
        auth: true,
        data:{
          roles:['coach']
        }
      }).state('provider-response', {
        url: '/commerce/provider/response/:id',
        templateUrl: 'app/commerce/provider/success/success.html',
        controller: 'ProviderResponseCtrl',
        auth: false
      });
  });