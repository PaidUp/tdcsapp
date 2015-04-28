'use strict';

angular.module('convenienceApp')
  .controller('ProviderLandingCtrl', function ($rootScope, $scope, $state, $stateParams, AuthService) {
    AuthService.dest = 'provider-request';
  });