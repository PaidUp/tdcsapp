'use strict';

angular.module('convenienceApp')
  .controller('ProviderRequestCtrl', function ($scope, providerService) {
    $scope.submitted = false;
    $scope.registerProvider = function(){
        $scope.submitted = true;
        if($scope.providerForm.$valid && $scope.ownerForm.$valid && $scope.billingForm.$valid){
            providerService.createProvider($scope.team,$scope.owner,$scope.billing);
        };
    }
    
  });