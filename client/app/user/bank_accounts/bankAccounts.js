'use strict';

angular.module('convenienceApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('user-bank-create', {
        url: '/user/bank/account/create',
        templateUrl: 'app/user/bank_accounts/create_bank_account.html',
        controller: 'BankAccountCreateCtrl',
        auth: true
      });
  });