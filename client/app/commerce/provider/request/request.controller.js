'use strict';

angular.module('convenienceApp')
  .controller('ProviderRequestCtrl', function ($scope, providerService) {
    $scope.submitted = false;
    $scope.registerProvider = function(){
        $scope.submitted = true;
        if($scope.providerForm.$valid && $scope.ownerForm.$valid && $scope.billingForm.$valid){
            //console.log('listo para conectarse con el servicio provider');
            providerService.saveProvider($scope.team,$scope.owner,$scope.billing);
        };
        /*console.log('providerForm.dirty',$scope.providerForm.dirty);
        console.log('dirty',$scope.dirty);
        console.log('team',$scope.team);
        console.log('owner',$scope.owner);
        console.log('billing',$scope.billing);*/
    }

    
  });