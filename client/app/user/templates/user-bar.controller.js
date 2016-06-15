'use strict';

angular.module('convenienceApp')
  .controller('UserBarCtrl', function ($state, $scope, AuthService) {
    $scope.tabs = [
      {
        heading: 'Profile',
        state: 'user-account',
        active: $state.is('user-account'),
        role: 'user'
      },
      {
        heading: 'Payment Methods',
        state: 'user-payments',
        active: $state.is('user-payments'),
        role: 'user'
      },
      {
        heading: 'Enrollments',
        state: 'user-enrollments',
        active: $state.is('user-enrollments'),
        role: 'user'
      }
    ];

    $scope.validate = function(role){
      return AuthService.validateRole(role);
    }

    $scope.$on('$stateChangeSuccess', function () {
      angular.forEach($scope.tabs, function(tab) {
        tab.active = $state.is(tab.state);
      });
    });
  });
