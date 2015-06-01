'use strict';

angular.module('convenienceApp')
  .controller('ProviderRequestCtrl', function ($scope, providerService, UserService, $state) {
    $scope.states = UserService.getStates();
    $scope.submitted = false;
    $scope.registerProvider = function(){
        $scope.submitted = true;
        if($scope.providerForm.$valid && $scope.ownerForm.$valid && $scope.billingForm.$valid){
            $scope.provider.ownerDOB = $scope.provider.month + '/' + $scope.provider.day + '/' + $scope.provider.year;
            $scope.provider.dda = $scope.bankAccount.accountNumber,
            $scope.provider.aba = $scope.bankAccount.routingNumber,
            $scope.provider.ownerSSN = $scope.bankAccount.securitySocial
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
        $scope.bankForm.aba.$setValidity('aba', false);
        return;
      } else {
        $scope.bankAccount.routingNumber = $scope.bankAccount.routingNumber.replace(/ /g,'');
        if ($scope.bankAccount.routingNumber.length !== 9) {
          $scope.bankForm.aba.$setValidity('aba', false);
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
        $scope.bankForm.aba.$setValidity('aba', true);
      } else {
        $scope.bankForm.aba.$setValidity('aba', false);
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
        $scope.bankForm.dda.$setValidity('pattern', pattern.test($scope.bankAccount.accountNumber));
      } else {
        $scope.bankForm.dda.$setValidity('pattern', false);
      }
    };

    $scope.validateSSN = function () {
      $scope.bankAccount.securitySocial = angular.copy($scope.provider.ownerSSN);
      if ($scope.bankAccount.securitySocial) {
        var pattern = /^\d{4}$/;
        $scope.ownerForm.ownerSSN.$setValidity('pattern', pattern.test($scope.bankAccount.securitySocial));
      } else {
        $scope.ownerForm.ownerSSN.$setValidity('pattern', false);
      }
    };

    $scope.maskSSN = function () {
      if ($scope.provider.ownerSSN) {
        $scope.bankAccount.securitySocial = angular.copy($scope.provider.ownerSSN);
        var temp = '';
        for(var i=0; i<$scope.provider.ownerSSN.length; i++) {
          temp += '*';
        }
        $scope.provider.ownerSSN = temp;
      }
    };

    $scope.unmaskSSN = function () {
      if ($scope.bankAccount.securitySocial) {
        $scope.provider.ownerSSN = angular.copy($scope.bankAccount.securitySocial);
      }
    };
    
  });