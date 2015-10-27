'use strict';

angular.module('convenienceApp')
  .controller('BankAccountCreateCtrl', function ($scope, AuthService) {
    $scope.user = angular.extend({}, AuthService.getCurrentUser());
  });
