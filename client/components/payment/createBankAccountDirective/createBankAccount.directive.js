'use strict';

angular.module('convenienceApp')
  .directive('createBankAccount', function () {
    return {
      restrict: 'E',
      scope: {
        user: '='
      },
      templateUrl: 'components/payment/createBankAccountDirective/createBankAccount.html',
      controller: 'CreateBankAccountCtrl'
    };
  });
