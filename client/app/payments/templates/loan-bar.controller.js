'use strict';

angular.module('convenienceApp')
  .controller('LoanBarCtrl', function ($state, $scope) {
    $scope.tabs = [
/**
      {
        heading: 'Bank Account',
        state: 'payment-loan-index',
        active: $state.is('payment-loan-index')
      },
**/

      {
        heading: 'Bank Account',
        state: 'bank-account-index',
        active: $state.is('bank-account-index')
      },

      {
        heading: 'Payment Method',
        state: 'payment-credit-card',
        active: $state.is('payment-credit-card')
      }
    ];
    $scope.$on('$stateChangeSuccess', function () {
      angular.forEach($scope.tabs, function(tab) {
        tab.active = $state.is(tab.state);
      });
    });
  });
