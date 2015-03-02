'use strict';

angular.module('convenienceApp')
  .controller('VerifyBankAccountCtrl', function ($rootScope, $scope, $state, FlashService, $stateParams, PaymentService, AuthService) {
    $rootScope.$emit('bar-welcome', {
      left:{
        url: ''
      } ,
      right:{
        url: ''
      }
    });

    $scope.sendAlertErrorMsg = function (msg) {
      $rootScope.msg = msg;
      FlashService.addAlert({
        type: 'danger',
        msg: $scope.msg,
        timeout: 10000
      });
    };

    var bankId;
    var verifyId;
    if ($stateParams.bankId && $stateParams.verifyId) {
      bankId = $stateParams.bankId;
      verifyId = $stateParams.verifyId;
    } else {
      $state.go('user-payments');
    }

    PaymentService.getBankAccount(bankId).then(function (bank) {
      $scope.bankAccount = bank.bankAccounts[0];
    });

    $scope.validateDeposit = function (inputForm) {
      var deposit1 = '0.' + $scope.deposit1;
      var deposit2 = '0.' + $scope.deposit2;
      if (isNaN(deposit1) && inputForm === 'deposit1') {
        $scope.verifyBankAccountForm.deposit1.$setValidity('deposit', false);
      } else {
        $scope.verifyBankAccountForm.deposit1.$setValidity('deposit', true);
      }

      if (isNaN(deposit2) && inputForm === 'deposit2') {
        $scope.verifyBankAccountForm.deposit2.$setValidity('deposit', false);
      } else {
        $scope.verifyBankAccountForm.deposit2.$setValidity('deposit', true);
      }
    };

    $scope.verifyBankAccount = function () {
      $scope.submitted = true;
      if ($scope.verifyBankAccountForm.$valid) {
        PaymentService.verifyBankAccount({
          deposit1: $scope.deposit1,
          deposit2: $scope.deposit2,
          verificationId: verifyId
        }).then(function (res) {
          $state.go('athletes');
          AuthService.updateCurrentUser();
          FlashService.addAlert({
            type: 'success',
            templateUrl: 'components/application/alert_directive/alerts/verify_bank_account_success.html',
            timeout: 10000
          });
        }).catch(function (err) {
    			if(err.data.attemptsRemaining === 0){
    				$rootScope.attemptsRemaining = err.data.attemptsRemaining;
    				$state.go('user-payments');
    			}
          $scope.sendAlertErrorMsg(err.data.message);
          $rootScope.attemptsRemaining = err.data.attemptsRemaining;
        });
      }
    };
  });