'use strict';

angular.module('convenienceApp')
  .controller('ProductOptionsCtrl', function ($scope) {

    $scope.changeCustomOptions = function (customOption) {
      $scope.ngModel = customOption;
    };
  });