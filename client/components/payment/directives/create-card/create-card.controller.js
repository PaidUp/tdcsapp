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
        /*
        var payload = {
          name: $scope.card.nameOnCard,
          card_number: $scope.card.cardNumber,
          expiration_month: $scope.card.expirationDate.month,≤≤
          expiration_year: $scope.card.expirationDate.year,
          security_code: $scope.card.securityCode,
          postal_code: $scope.card.zipCode
        };*/
        //jesse
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
              PaymentService.associateCard(token).then(function () {
                $scope.loading = false;
                $state.go('user-payments');
                TrackerService.create('Create card success',{});
              }).catch(function (err) {
                $scope.loading = false;
                $scope.sendAlertErrorMsg('Oops. Invalid card. Please check the number and try again.');
                //$scope.sendAlertErrorMsg(err.data.message);
                TrackerService.create('Create card error', 'Oops. Invalid card. Please check the number and try again.');
              });
            }
          });
        /*
        balanced.card.create(payload, function (response) {
          if(response.status === 201) {
            PaymentService.associateCard(response.data.id).then(function () {
              $scope.loading = false;
              $state.go('user-payments');
            }).catch(function (err) {
              $scope.loading = false;
              $scope.sendAlertErrorMsg(err.data.message);
            });
          } else {
            $scope.loading = false;
            $scope.placedOrder = false;
            if (response.error && response.error.message) {
              $scope.sendAlertErrorMsg(response.error.message);
            } else if (Object.keys(response.error).length !== 0) {
              for (var key in response.error) {
                $scope.sendAlertErrorMsg(response.error[key]);
              }
            }else {
              $scope.sendAlertErrorMsg('Failed to Billing you, check your information');
            }
          }
        });*/
      }else {
        $scope.sendAlertErrorMsg('Hey, you left some fields blank. Please fill them out.');
        TrackerService.create('Create card error' , 'Hey, you left some fields blank. Please fill them out.');
      }
    };
  });
