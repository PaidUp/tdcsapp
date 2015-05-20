'use strict';

angular.module('convenienceApp')
  .controller('ProviderRequestCtrl', function ($scope, providerService, UserService) {
    $scope.states = UserService.getStates();
    $scope.submitted = false;
    $scope.registerProvider = function(){
        $scope.submitted = true;
        //TODO
        //set onwerDOB
        if($scope.providerForm.$valid){
            $scope.provider.ownerDOB = $scope.provider.month + '/' + $scope.provider.day + '/' + $scope.provider.year;
            providerService.providerRequest($scope.provider);
        };
    }
    
  });