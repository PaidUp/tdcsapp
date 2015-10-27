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
    $scope.loadingBanks = true;
    $scope.loadingCards = true;

    $scope.sendAlertErrorMsg = function (msg) {
      FlashService.addAlert({
        type: 'danger',
        msg: msg,
        timeout: 10000
      });
    };

    //Bank accounts
    function loadBanks(){
      PaymentService.listBankAccounts().then(function (response) {
        if(response.defaultSource){
          $scope.defaultSource = response.defaultSource;
        }
        $scope.bankAccounts = angular.copy(response.data);
        $scope.loadingBanks = false;
        for (var i=0; i<$scope.bankAccounts.length; i++) {
          if ($scope.bankAccounts[i].id === response.defaultSource) {
            $scope.bankAccounts[i].radio = true;
          } else {
            $scope.bankAccounts[i].radio = false;
          }
        }
      }).catch(function (err) {
        $scope.loadingBanks = false;
        $scope.sendAlertErrorMsg(err.data.message);
      });
    }

    loadBanks();

    function loadCards(){
      PaymentService.listCards().then(function (response) {
        if(response.defaultSource){
          $scope.defaultSource = response.defaultSource;
        }
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
        $scope.sendAlertErrorMsg(err.message);
      });
    }

    loadCards();

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
      $scope.loadingBanks = true;
      $scope.loadingCards = true;
      PaymentService.updateCustomer({cardId:cardId}).then(function(res){
        $scope.defaultSource = res.defaultSource;
        loadBanks();
        loadCards();
        TrackerService.create('Update card default' , {});
      }).catch(function(err){
        TrackerService.create('Update card default', err.data.message);
        $scope.sendAlertErrorMsg(err.data.message);
      });
    };
  });
