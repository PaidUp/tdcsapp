'use strict';

angular.module('convenienceApp')
  .controller('UserBarCtrl', function ($state, $scope) {
    $scope.tabs = [
      {
        heading: 'Profile',
        state: 'user-account',
        active: $state.is('user-account')
      },
      {
        heading: 'Payment Methods',
        state: 'user-payments',
        active: $state.is('user-payments')
      },
      {
        heading: 'Enrollments',
        state: 'user-enrollments',
        active: $state.is('user-enrollments')
      }
    ];
    $scope.$on('$stateChangeSuccess', function () {
      angular.forEach($scope.tabs, function(tab) {
        tab.active = $state.is(tab.state);
      });
    });
  });