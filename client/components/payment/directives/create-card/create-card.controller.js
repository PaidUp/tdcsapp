'use strict';

angular.module('convenienceApp')
  .controller('CreateCardCtrl', function ($scope, $rootScope, $state, LoanService, PaymentService, FlashService,
                                          ApplicationConfigService, TrackerService) {
    TrackerService.pageTrack();
    $scope.card = {};
    $scope.loading = false;

    ApplicationConfigService.getConfig().then(function (config) {
      Stripe.setPublishableKey(config.stripeApiPublic);
    });

    $scope.sendAlertErrorMsg = function (msg) {
      FlashService.addAlert({
        type: 'danger',
        msg: msg,
        timeout: 10000
      });
    };

    if ($state.current.name === 'payment-account-index') {
      $scope.submitButtonName = 'Place Order';
    }else {
      $scope.submitButtonName = 'Create card';
    }

    $scope.validateInput = function () {
      if ($scope.card && $scope.card.cardNumber && Stripe.card.validateCardNumber($scope.card.cardNumber)) {
        $scope.createCardForm.cardNumber.$setValidity('format', true);
      } else {
        $scope.createCardForm.cardNumber.$setValidity('format', false);
      }
      if ($scope.card && $scope.card.expirationDate && $scope.card.expirationDate.month &&
          $scope.card.expirationDate.year &&
          Stripe.card.validateExpiry($scope.card.expirationDate.month, $scope.card.expirationDate.year)) {
        $scope.createCardForm.$setValidity('expiration', true);
      } else {
        $scope.createCardForm.$setValidity('expiration', false);
      }
    };

    $scope.createCard = function () {
      TrackerService.trackFormErrors('Create card form',$scope.createCardForm);
      $scope.submitted = true
      if ($scope.createCardForm.$valid) {
        $scope.loading = true;
        var zipCode;
        if ($scope.needZipcode) {
          zipCode = $scope.card.zipCode;
        }
        Stripe.card.createToken({
          number: $scope.card.cardNumber,
          cvc: $scope.card.securityCode,
          exp_month: $scope.card.expirationDate.month,
          exp_year: $scope.card.expirationDate.year,
          name : $scope.card.nameOnCard
        }, function stripeResponseHandler(status, response) {
            if (response.error) {
              $scope.loading = false;
              $scope.placedOrder = false;
              if (response.error && response.error.message) {
                $scope.sendAlertErrorMsg(response.error.message);
                TrackerService.create('Create credit card error' , response.error.message);
              } else if (Object.keys(response.error).length !== 0) {
                for (var key in response.error) {
                  $scope.sendAlertErrorMsg(response.error[key]);
                  TrackerService.create('Create credit card error' , response.error[key]);
                }
              }else {
                $scope.sendAlertErrorMsg('Hey, you left some fields blank. Please fill them out.');
                TrackerService.create('Create credit card error' , 'Hey, you left some fields blank. Please fill them out.');
              }
            } else {
              var token = response.id;
              PaymentService.associateCard(token).then(function (source) {
                if($state.current.name === 'user-card-create'){
                  $scope.loading = false;
                  $state.go('user-payments');
                }else if ($state.current.name === 'payment-account-index') {
                  $scope.$parent.placeOrder('card',source);
                }
                TrackerService.create('Create card success',{});
              }).catch(function (err) {
                $scope.loading = false;
                $scope.sendAlertErrorMsg('Oops. Invalid card. Please check the number and try again.');
                //$scope.sendAlertErrorMsg(err.data.message);
                TrackerService.create('Create card error', 'Oops. Invalid card. Please check the number and try again.');
              });
            }
          });

      }else {
        $scope.sendAlertErrorMsg('Hey, you left some fields blank. Please fill them out.');
        TrackerService.create('Create card error' , 'Hey, you left some fields blank. Please fill them out.');
      }
    };
  });
