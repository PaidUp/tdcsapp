'use strict';

angular.module('convenienceApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('phone-authorization', {
        url: '/phone-authorization',
        templateUrl: 'app/application/phone-authorization/phone-authorization.html'
      });
  });