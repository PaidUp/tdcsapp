'use strict';

angular.module('convenienceApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('user-bank-create', {
        url: '/user/bank/account/create',
        templateUrl: 'app/user/bankAccounts/createBankAccount.html',
        controller: 'BankAccountCreateCtrl',
        auth: true
      });
  });