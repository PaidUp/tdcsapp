'use strict';

angular.module('convenienceApp')
  .controller('ProviderLandingCtrl', function ($rootScope, $scope, $state, $stateParams, AuthService) {
    AuthService.destPath('provider-request');

    $scope.showContactUsForm = false;

    $scope.togggleForm = function(){
      $scope.showContactUsForm = !$scope.showContactUsForm;
    };

    $scope.solution = [true,true,true];

    $scope.showSolution = function(pos, val){
      $scope.solution[pos] = val;
    };

  });
