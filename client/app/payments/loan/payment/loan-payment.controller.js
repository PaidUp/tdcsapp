'use strict';

angular.module('convenienceApp')
  .controller('LoanPaymentCtrl', function ($rootScope, $scope, $state, FlashService, LoanService, CartService, ApplicationConfigService) {

    var loanUserId;
    $scope.sendAlertErrorMsg = function (msg) {
      FlashService.addAlert({
        type: 'danger',
        msg: msg,
        timeout: 10000
      });
    };

    ApplicationConfigService.getConfig().then(function (config) {
      //balanced.init('/v1/marketplaces/'+config.marketplace);
    });

    LoanService.verifyApplicationState().then(function (applicationState) {
      loanUserId = applicationState.meta[0].userId;
      LoanService.getLoanApplicationUser(loanUserId).then(function (loanUser) {
        $scope.user = loanUser;
      });
      if (applicationState.state === 'SIGNED') {
        // nothing
      } else if (applicationState.state === 'APPLIED' || applicationState.state === 'ACCEPTED_CREDIT_CHECK') {
        $state.go('payment-loan-sign-contract');
      } else if (applicationState.state === 'DENIED_CREDIT_CHECK') {
        // $state.go('cart');
        // nothing
      } else { //  (applicationState.state === 'BANK_REGISTERED') or others
        $state.go('cart');
      }
    }).catch(function (err) {
      $scope.sendAlertErrorMsg(err.data.message);
      $state.go('cart');
    });

    var cartId = CartService.getCurrentCartId();
    if (cartId) {
      CartService.getTotals(cartId).then(function (totals) {
        angular.forEach(totals, function (total) {
          if (total.title === 'Grand Total') {
            $scope.total = total;
            LoanService.getLoan().then(function (loanData) {
              $scope.paymentPlan = {
                loanAmount: loanData.amount,
                monthlyPayment: loanData.schedule[0].installment,
                term: '6 months',
                apr: loanData.interestRate
              };
              $scope.paymentSchedule = loanData.schedule;
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

    $rootScope.$emit('bar-welcome', {
      left:{
        url: 'app/payments/templates/loan-payment-bar.html'
      } ,
      right:{
        url: 'app/payments/templates/loan-apply-state-bar.html'
      }
    });

    $scope.prettify = function (date) {
      return moment(date).format('dddd MMMM DD, YYYY');
    };
  });