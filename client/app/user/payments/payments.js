'use strict';

angular.module('convenienceApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('user-payments', {
        url: '/user/payments',
        templateUrl: 'app/user/payments/payments.html',
        controller: 'UserPaymentsCtrl',
        auth: true
      }).state('verify-bank-account', {
        url: '/user/payments/bank/:bankId/verify/:verifyId',
        templateUrl: 'app/user/payments/verifyBankAccount/verifyBankAccount.html',
        controller: 'VerifyBankAccountCtrl',
        auth: true
      });
  });