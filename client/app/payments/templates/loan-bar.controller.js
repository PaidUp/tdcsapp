'use strict';

angular.module('convenienceApp')
  .controller('LoanBarCtrl', function ($state, $scope) {
    $scope.tabs = [
     /*
      {
        heading: 'Loan',
        state: 'payment-loan-index',
        active: $state.is('payment-loan-index')
      },
      */
      {
        heading: 'Credit Card',
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