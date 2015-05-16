'use strict';

angular.module('convenienceApp')
  .controller('ProviderLandingCtrl', function ($rootScope, $scope, $state, $stateParams, AuthService) {
    AuthService.dest = 'provider-request';

    $scope.showContactUsForm = false;

    $scope.togggleForm = function(){
      $scope.showContactUsForm = !$scope.showContactUsForm;
    };

    $scope.solution1 = true;

    $scope.showSolution1 = function(){
      $scope.solution1 = true;
    };

    $scope.hideSolution1 = function(){
      $scope.solution1 = false;
    };

    $scope.solution2 = true;

    $scope.showSolution2 = function(){
      $scope.solution2 = true;
    };

    $scope.hideSolution2 = function(){
      $scope.solution2 = false;
    };

    $scope.solution3 = true;

    $scope.showSolution3 = function(){
      $scope.solution3 = true;
    };

    $scope.hideSolution3 = function(){
      $scope.solution3 = false;
    };


  });
