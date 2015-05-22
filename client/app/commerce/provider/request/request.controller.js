'use strict';

angular.module('convenienceApp')
  .controller('ProviderRequestCtrl', function ($scope, providerService, UserService, $state) {
    $scope.states = UserService.getStates();
    $scope.submitted = false;
    $scope.registerProvider = function(){
        $scope.submitted = true;
        if($scope.providerForm.$valid){
            $scope.provider.ownerDOB = $scope.provider.month + '/' + $scope.provider.day + '/' + $scope.provider.year;
            $scope.provider.dda = $scope.bankAccount.accountNumber,
            $scope.provider.aba = $scope.bankAccount.routingNumber
            providerService.providerRequest($scope.provider).then(function(data){
                $state.go('provider-success'); 
            }).catch(function(err){
                console.log(err);
            });

        };
    };

    $scope.bankAccount = {};

    $scope.maskABA = function () {
      if ($scope.provider.aba) {
        $scope.bankAccount.routingNumber = angular.copy($scope.provider.aba);
        var temp = '';
        for(var i=0; i<$scope.provider.aba.length; i++) {
          temp += '*';
        }
        $scope.provider.aba = temp;
      }
    };

    $scope.unmaskABA = function () {
      if ($scope.bankAccount.routingNumber) {
        $scope.provider.aba = angular.copy($scope.bankAccount.routingNumber);
      }
    };

    $scope.ABAValidator = function () {
      // Taken from: http://www.brainjar.com/js/validation/
      $scope.bankAccount.routingNumber = angular.copy($scope.provider.aba);
      if (!$scope.bankAccount.routingNumber) {
        $scope.billingForm.aba.$setValidity('aba', false);
        return;
      } else {
        $scope.bankAccount.routingNumber = $scope.bankAccount.routingNumber.replace(/ /g,'');
        if ($scope.bankAccount.routingNumber.length !== 9) {
          $scope.billingForm.aba.$setValidity('aba', false);
          return;
        }
      }
      var t = $scope.bankAccount.routingNumber.replace(/ /g,'');
      var n = 0;
      for (var i = 0; i < t.length; i += 3) {
        n += parseInt(t.charAt(i),     10) * 3 +
              parseInt(t.charAt(i + 1), 10) * 7 +
              parseInt(t.charAt(i + 2), 10);
      }

      // If the resulting sum is an even multiple of ten (but not zero),
      // the aba routing number is good.

      if (n !== 0 && n % 10 === 0) {
        $scope.billingForm.aba.$setValidity('aba', true);
      } else {
        $scope.billingForm.aba.$setValidity('aba', false);
      }
    };

    $scope.maskDDA = function () {
      if ($scope.provider.dda) {
        $scope.bankAccount.accountNumber = angular.copy($scope.provider.dda);
        var temp = '';
        for(var i=0; i<$scope.provider.dda.length; i++) {
          temp += '*';
        }
        $scope.provider.dda = temp;
      }
    };

    $scope.unmaskDDA = function () {
      if ($scope.bankAccount.accountNumber) {
        $scope.provider.dda = angular.copy($scope.bankAccount.accountNumber);
      }
    };

    $scope.maskDDAVerification = function () {
      $scope.bankAccount.accountNumberVerification = angular.copy($scope.provider.ddaVerification);
      if ($scope.provider.ddaVerification) {
        var temp = '';
        for(var i=0; i<$scope.provider.ddaVerification.length; i++) {
          temp += '*';
        }
        $scope.provider.ddaVerification = temp;
      }
    };

    $scope.unmaskDDAVerification = function () {
      if ($scope.bankAccount.accountNumberVerification) {
        $scope.provider.ddaVerification = angular.copy($scope.bankAccount.accountNumberVerification);
      }
    };

    $scope.validateDDA = function () {
      $scope.bankAccount.accountNumber = angular.copy($scope.provider.dda);
      if ($scope.bankAccount.accountNumber) {
        var pattern = /^\d{4,}$/;
        $scope.billingForm.dda.$setValidity('pattern', pattern.test($scope.bankAccount.accountNumber));
      } else {
        $scope.billingForm.dda.$setValidity('pattern', false);
      }
    };
    
  });