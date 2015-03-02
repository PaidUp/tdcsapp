'use strict';

angular.module('convenienceApp')
  .directive('createBankAccount', function () {
    return {
      restrict: 'E',
      scope: {
        user: '='
      },
      templateUrl: 'components/payment/create_bank_account_directive/create_bank_account.html',
      controller: 'CreateBankAccountCtrl'
    };
  });
