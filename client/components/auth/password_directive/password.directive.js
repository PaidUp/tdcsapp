'use strict';

angular.module('convenienceApp')
  .directive('password', function() {
      return {
        restrict: 'E',
        templateUrl: 'components/auth/password_directive/password.html',
        scope: {
          password: '=',
          confirm: '=',
          form: '=passwordForm'
        }
      };
    });