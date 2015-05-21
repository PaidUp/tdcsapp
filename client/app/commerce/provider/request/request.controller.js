'use strict';

angular.module('convenienceApp')
  .controller('ProviderRequestCtrl', function ($scope, providerService, UserService, $state) {
    $scope.states = UserService.getStates();
    $scope.submitted = false;
    $scope.registerProvider = function(){
        $scope.submitted = true;
        if($scope.providerForm.$valid){
            $scope.provider.ownerDOB = $scope.provider.month + '/' + $scope.provider.day + '/' + $scope.provider.year;
            providerService.providerRequest($scope.provider).then(function(data){
                $state.go('provider-success'); 
            }).catch(function(err){
                console.log(err);
            });

        };
    }
    
  });