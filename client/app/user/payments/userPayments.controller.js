'use strict';

angular.module('convenienceApp')
  .controller('UserPaymentsCtrl', function ($rootScope, $scope, $state, PaymentService, FlashService, AuthService) {
    $rootScope.$emit('bar-welcome', {
      left:{
        url: 'app/user/templates/userBar.html'
      } ,
      right:{
        url: ''
      }
    });
    $scope.loadingBanks = true;
    $scope.loadingCards = true;

    $scope.sendAlertErrorMsg = function (msg) {
      FlashService.addAlert({
        type: 'danger',
        msg: msg,
        timeout: 10000
      });
    };

    PaymentService.listBankAccounts().then(function (response) {
      $scope.bankAccounts = angular.copy(response.bankAccounts);
      $scope.loadingBanks = false;
    }).catch(function (err) {
      $scope.loadingBanks = false;
      $scope.sendAlertErrorMsg(err.data.message);
    });

    PaymentService.listCards().then(function (response) {
      $scope.loadingCards = false;
      $scope.cards = angular.copy(response.cards);
    }).catch(function (err) {
      $scope.loadingCards = false;
      $scope.sendAlertErrorMsg(err.data.message);
    });

    $scope.verifyAccount = function (account) {
      $state.go('verify-bank-account', {
        bankId: account.id,
        verifyId: account.links.bankAccountVerification
      });
    };

    $scope.removeAccount = function (account) {

    };

    $scope.deleteBankAccount = function(index, account){
      PaymentService.deleteBankAccount(account.links.customer, account.id).then(function(res){
        $scope.bankAccounts.splice(index, 1);
        $rootScope.$emit('$stateChangeSuccess', AuthService.updateCurrentUser());
        $rootScope.msg = 'The bank account has been removed successfully';
        FlashService.addAlert({
          type: 'success',
          msg: $scope.msg,
          timeout: 10000
        });  
      }).catch(function(err){
        $scope.sendAlertErrorMsg(err.data.message);
      });
    };
  });