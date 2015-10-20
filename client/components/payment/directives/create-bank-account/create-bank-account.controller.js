'use strict';

angular.module('convenienceApp')
  .controller('CreateBankAccountCtrl', function ($scope, $rootScope, $state, LoanService, PaymentService, FlashService, ApplicationConfigService, CartService, AuthService, $timeout) {
    $scope.bankAccount = {};
    $scope.loading = false;

    $scope.sendAlertErrorMsg = function (msg) {
      FlashService.addAlert({
        type: 'danger',
        msg: msg,
        timeout: 10000
      });
    };

    ApplicationConfigService.getConfig().then(function (config) {
      //balanced.init('/v1/marketplaces/'+config.marketplace);
      Stripe.setPublishableKey(config.stripeApiPublic);
    });

    $scope.maskABA = function () {
      if ($scope.inputRoutingNumber) {
        $scope.bankAccount.routingNumber = angular.copy($scope.inputRoutingNumber);
        var temp = '';
        for(var i=0; i<$scope.inputRoutingNumber.length; i++) {
          temp += '*';
        }
        $scope.inputRoutingNumber = temp;
      }
    };

    $scope.unmaskABA = function () {
      if ($scope.bankAccount.routingNumber) {
        $scope.inputRoutingNumber = angular.copy($scope.bankAccount.routingNumber);
      }
    };

    $scope.maskDDA = function () {
      if ($scope.inputAccountNumber) {
        $scope.bankAccount.accountNumber = angular.copy($scope.inputAccountNumber);
        var temp = '';
        for(var i=0; i<$scope.inputAccountNumber.length; i++) {
          temp += '*';
        }
        $scope.inputAccountNumber = temp;
      }
    };

    $scope.unmaskDDA = function () {
      if ($scope.bankAccount.accountNumber) {
        $scope.inputAccountNumber = angular.copy($scope.bankAccount.accountNumber);
      }
    };

    $scope.maskABAVerification = function () {
      $scope.bankAccount.routingNumberVerification = angular.copy($scope.inputRoutingNumberVerification);
      if ($scope.inputRoutingNumberVerification) {
        var temp = '';
        for(var i=0; i<$scope.inputRoutingNumberVerification.length; i++) {
          temp += '*';
        }
        $scope.inputRoutingNumberVerification = temp;
      }
    };

    $scope.unmaskABAVerification = function () {
      if ($scope.bankAccount.routingNumberVerification) {
        $scope.inputRoutingNumberVerification = angular.copy($scope.bankAccount.routingNumberVerification);
      }
    };

    $scope.maskDDAVerification = function () {
      $scope.bankAccount.accountNumberVerification = angular.copy($scope.inputAccountNumberVerification);
      if ($scope.inputAccountNumberVerification) {
        var temp = '';
        for(var i=0; i<$scope.inputAccountNumberVerification.length; i++) {
          temp += '*';
        }
        $scope.inputAccountNumberVerification = temp;
      }
    };

    $scope.unmaskDDAVerification = function () {
      if ($scope.bankAccount.accountNumberVerification) {
        $scope.inputAccountNumberVerification = angular.copy($scope.bankAccount.accountNumberVerification);
      }
    };

    $scope.ABAValidator = function () {
      // Taken from: http://www.brainjar.com/js/validation/
      $scope.bankAccount.routingNumber = angular.copy($scope.inputRoutingNumber);
      var t = $scope.bankAccount.routingNumber.replace(/ /g,'');
            $scope.paymentForm.aba.$setValidity('aba', Stripe.bankAccount.validateRoutingNumber(t, 'US'));
    };

    $scope.validateDDA = function () {
      $scope.bankAccount.accountNumber = angular.copy($scope.inputAccountNumber);
      if ($scope.bankAccount.accountNumber) {
        var pattern = /^\d{4,}$/;
        $scope.paymentForm.dda.$setValidity('pattern', pattern.test($scope.bankAccount.accountNumber));
      } else {
        $scope.paymentForm.dda.$setValidity('pattern', false);
      }
    };

    $scope.verifyMatches = function () {
      if (!$scope.bankAccount) {
        return;
      }
      if ($scope.bankAccount.routingNumberVerification === $scope.bankAccount.routingNumber) {
        $scope.paymentForm.abaVerification.$setValidity('match', true);
      } else {
        $scope.paymentForm.abaVerification.$setValidity('match', false);
      }

      if ($scope.bankAccount.accountNumberVerification === $scope.bankAccount.accountNumber) {
        $scope.paymentForm.ddaVerification.$setValidity('match', true);
      } else {
        $scope.paymentForm.ddaVerification.$setValidity('match', false);
      }
    };

    $scope.confirmLoanPayment = function () {
      console.log('confirmLoanPayment');
      $scope.submitted = true;
      $scope.verifyMatches();
      if ($scope.paymentForm.$valid) {
        $scope.loading = true;
        var payload = {
          country : 'US',
          currency : 'USD',
          account_number: $scope.bankAccount.accountNumber,
          routing_number: $scope.bankAccount.routingNumber
        };

        Stripe.bankAccount.createToken(
          payload, function(status, response){
            if(status === 200) {
              PaymentService.associateBankPayment({tokenId: response.id}).then(function () {
                if ($state.current.name === 'user-bank-create') {
                  AuthService.updateCurrentUser();
                  $state.go('user-payments');
                  $scope.loading = false;
                } else if ($state.current.name === 'payment-loan-payment') {
                  CartService.removeCurrentCart();
                  LoanService.removeCurrentLoanApplication();
                  AuthService.updateCurrentUser();
                  $scope.loading = false;
                  $state.go('thank-you');
                }
              }).catch(function (err) {
                $scope.loading = false;
                console.log('ERROR: ', err);
                console.log('BANKID: ', response.id);
                $scope.sendAlertErrorMsg(err.message);
              });
            } else {
              $scope.loading = false;
              $timeout(function () {
                $scope.sendAlertErrorMsg(response.error.description);
              }, 1000);
            }









          });


        /*balanced.bankAccount.create(payload, function (response) {
          if(response.status === 201) {
            PaymentService.createBankPayment({bankId: response.data.id}).then(function () {
              if ($state.current.name === 'user-bank-create') {
                AuthService.updateCurrentUser();
                $state.go('user-payments');
                $scope.loading = false;
              } else if ($state.current.name === 'payment-loan-payment') {
                CartService.removeCurrentCart();
                LoanService.removeCurrentLoanApplication();
                AuthService.updateCurrentUser();
                $scope.loading = false;
                $state.go('thank-you');
              }
            }).catch(function (err) {
              $scope.loading = false;
              console.log('ERROR: ', err);
              console.log('BANKID: ', response.data.id);
              $scope.sendAlertErrorMsg(err.data.message);
            });
          } else {
            $scope.loading = false;
            $timeout(function () {
              $scope.sendAlertErrorMsg(response.error.description);
            }, 1000);
          }
        });*/
      }
    };
  });
