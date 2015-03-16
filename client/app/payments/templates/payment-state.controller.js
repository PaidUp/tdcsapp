'use strict';

angular.module('convenienceApp')
  .controller('PaymentStateCtrl', function ($state, $scope) {
    $scope.states = [
      {
        title: 'apply',
        active: $state.is('payment-loan-apply'),
        state: 'payment-loan-apply'
      },
      {
        title: 'sign contract',
        active: $state.is('payment-loan-sign-contract'),
        state: 'payment-loan-sign-contract'
      },
      {
        title: 'payment',
        active: $state.is('payment-loan-payment'),
        state: 'payment-loan-payment'
      }
    ];

    $scope.$on('$stateChangeSuccess', function () {
      angular.forEach($scope.states, function(state) {
        state.active = $state.is(state.state);
      });
    });
  });