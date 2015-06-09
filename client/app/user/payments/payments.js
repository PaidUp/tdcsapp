'use strict';

angular.module('convenienceApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('user-payments', {
        url: '/user/payments',
        templateUrl: 'app/user/payments/payments.html',
        controller: 'UserPaymentsCtrl',
        auth: true,
        data:{
          roles:['user', 'coach']
        }
      }).state('verify-bank-account', {
        url: '/user/payments/bank/:bankId/verify/:verifyId',
        templateUrl: 'app/user/payments/verify-bank-account/verify-bank-account.html',
        controller: 'VerifyBankAccountCtrl',
        auth: true,
        data:{
          roles:['user', 'coach']
        }
      });
  });