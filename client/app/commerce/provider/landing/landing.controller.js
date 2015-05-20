'use strict';

angular.module('convenienceApp')
  .controller('ProviderLandingCtrl', function ($rootScope, $scope, $state, $stateParams, AuthService) {
    AuthService.dest = 'provider-request';

    $scope.showContactUsForm = false;

    $scope.togggleForm = function(){
      $scope.showContactUsForm = !$scope.showContactUsForm;
    };

    $scope.solution = [true,true,true];

    $scope.showSolution = function(pos, val){
      console.log('pos', pos);
      console.log('val', val);
      $scope.solution[pos] = val;
    };

  });
