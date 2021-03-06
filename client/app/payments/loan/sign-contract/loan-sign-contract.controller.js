'use strict';

angular.module('convenienceApp')
  .controller('LoanSignContractCtrl', function ($rootScope, $scope, ModalFactory, $state, LoanService, FlashService, CartService, PaymentService) {

    $scope.modalFactory = ModalFactory;
    $scope.contractHTML = '';
    var loanUserId;
    var applicationId;

    $scope.sendAlertErrorMsg = function (msg) {
      FlashService.addAlert({
        type: 'danger',
        msg: msg,
        timeout: 10000
      });
    };

    LoanService.verifyApplicationState().then(function (applicationState) {
      loanUserId = applicationState.meta[0].userId;
      if ( applicationState.state === 'ACCEPTED_CREDIT_CHECK') {
        // nothing
      } else if (applicationState.state === 'APPLIED') {
        // $scope.modalFactory.PrivacyAgreementModal();
        // nothing
      } else if (applicationState.state === 'DENIED_CREDIT_CHECK') {
        // $state.go('cart');
      } else if (applicationState.state === 'SIGNED') {
        $state.go('payment-loan-payment');
      } else { //  (applicationState.state === 'BANK_REGISTERED') or others
        $state.go('cart');
      }
    }).catch(function (err) {
      $scope.sendAlertErrorMsg(err.data.message);
      $state.go('cart');
    });

    var cartId = CartService.getCurrentCartId();
    if (cartId) {
      LoanService.verifyApplicationState().then(function (applicationState) {
        loanUserId = applicationState.meta[0].userId;
        applicationId = LoanService.getLoanApplicationId();
        LoanService.getContract(applicationId, loanUserId).then(function (html) {
          $scope.contractHTML = html.html;
        });
       }); 
      CartService.getTotals(cartId).then(function (totals) {
        angular.forEach(totals, function (total) {
          if (total.title === 'Grand Total') {
            $scope.total = total;
            LoanService.getLoanPaymentSimulation({
              amount: total.amount,
              numberPayments: 6,
              applicationId: LoanService.getLoanApplicationId()
            }).then(function (simulationData) {
              $scope.paymentPlan = {
                loanAmount: simulationData.amount,
                monthlyPayment: simulationData.installments[0].installment,
                term: '6 months',
                apr: simulationData.interestRate
              };
            });
          }
        });
      }).catch(function (err) {
        $scope.sendAlertErrorMsg(err.data.message);
        $state.go('cart');
      });
    } else {
      $scope.noCart = true;
      $state.go('cart');
    }

    $scope.signAgreement = function () {
      $scope.submitted = true;
      if ($scope.signContractForm.$valid) {
        $scope.loading = true;
        var user;
        LoanService.getLoanApplicationUser(loanUserId).then(function (loanUser) {
          user = loanUser[0];
          var signedContract = angular.copy($scope.signContract);
          signedContract.applicationId = LoanService.getLoanApplicationId();
          LoanService.signContract(signedContract, user).then(function () {

            // get loan address for billing
            var i;
            var loanAddress;
            for (i=0; i<loanUser[0].addresses.length; i++){
              if (loanUser[0].addresses[i].type === 'loan') {
                loanAddress = loanUser[0].addresses[i];
              };
            };
            // get telephone address for billing
            var i;
            var loanTelephone;
            for (i=0; i<loanUser[0].contacts.length; i++){
              if (loanUser[0].contacts[i].type === 'telephone') {
                loanTelephone = loanUser[0].contacts[i].value;
              };
            };

            var addressBilling = {
              mode: 'billing',
              firstName: loanUser[0].firstName,
              lastName: loanUser[0].lastName,
              address1: loanAddress.address1,
              address2: loanAddress.address2,
              city: loanAddress.city,
              state: loanAddress.state,
              zipCode: loanAddress.zipCode,
              country: loanAddress.country,
              telephone: loanTelephone
            };

            var addressShipping = angular.extend({}, addressBilling);
            addressShipping.mode = 'shipping';
            var payment = {
              cartId: cartId,
              addresses: [
                addressBilling,
                addressShipping
              ],
              loanId: LoanService.getLoanId(),
              userId: CartService.getUserId(),
              payment: 'loan',
              paymentMethod: 'directdebit'
            };

            PaymentService.sendPayment(payment).then(function () {
              $state.go('payment-loan-payment');
            }).catch(function (err) {
              $scope.loading = false;
              $scope.sendAlertErrorMsg(err.data.message);
            });
          }).catch(function (err) {
            $scope.loading = false;
            $scope.sendAlertErrorMsg(err.data.message);
          });
        }).catch(function (err) {
          $scope.loading = false;
          $scope.sendAlertErrorMsg(err.data.message);
        });
      }
    };

    $rootScope.$emit('bar-welcome', {
      left:{
        url: 'app/payments/templates/loan-sign-contract-bar.html'
      } ,
      right:{
        url: 'app/payments/templates/loan-apply-state-bar.html'
      }
    });
  });