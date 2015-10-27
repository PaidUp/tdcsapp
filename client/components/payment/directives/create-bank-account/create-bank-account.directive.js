'use strict';

angular.module('convenienceApp')
  .directive('createBankAccount', function () {
    return {
      restrict: 'E',
      templateUrl: 'components/payment/directives/create-bank-account/create-bank-account.html',
      controller: 'CreateBankAccountCtrl'
    };
  });
