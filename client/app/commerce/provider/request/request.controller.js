'use strict';

angular.module('convenienceApp')
  .controller('ProviderRequestCtrl', function ($scope, providerService) {
    $scope.submitted = false;
    $scope.registerProvider = function(){
        $scope.submitted = true;
        //TODO
        //set onwerDOB
        if($scope.providerForm.$valid){
            providerService.providerRequest($scope.provider);
        };
    }
    
  });