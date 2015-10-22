'use strict';

angular.module('convenienceApp')
  .controller('UserPaymentsCtrl', function ($rootScope, $scope, $state, PaymentService, FlashService, AuthService,
                                            TrackerService) {
    TrackerService.pageTrack();

    $rootScope.$emit('bar-welcome', {
      left:{
        url: 'app/user/templates/user-bar.html'
      } ,
      right:{
        url: ''
      }
    });
    $scope.loadingBanks = false;
    $scope.loadingCards = true;

    $scope.sendAlertErrorMsg = function (msg) {
      FlashService.addAlert({
        type: 'danger',
        msg: msg,
        timeout: 10000
      });
    };

    //Bank accounts
    PaymentService.listBankAccounts().then(function (response) {

      $scope.bankAccounts = angular.copy(response.data);
      console.log($scope.bankAccounts );
      $scope.loadingBanks = false;
    }).catch(function (err) {
      $scope.loadingBanks = false;
      $scope.sendAlertErrorMsg(err.data.message);
    });

    PaymentService.listCards().then(function (response) {
      $scope.defaultSource = response.defaultSource;
      $scope.loadingCards = false;
      $scope.cards = angular.copy(response.data);
      var i;
      for (i=0; i<$scope.cards.length; i++) {
        if ($scope.cards[i].id === response.defaultSource) {
          $scope.cards[i].radio = true;
        } else {
          $scope.cards[i].radio = false;
        }
      }
    }).catch(function (err) {
      $scope.loadingCards = false;
      $scope.sendAlertErrorMsg(err.data.message);
    });

    $scope.verifyAccount = function (account) {
      $state.go('verify-bank-account', {
        bankId: account.id
      });
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

    $scope.updateCardDefault = function(cardId){
      PaymentService.updateCustomer({cardId:cardId}).then(function(res){
        $scope.defaultSource = res.defaultSource;
        TrackerService.create('Update card default' , {});
      }).catch(function(err){
        TrackerService.create('Update card default', err.data.message);
        $scope.sendAlertErrorMsg(err.data.message);
      });
    };
  });
