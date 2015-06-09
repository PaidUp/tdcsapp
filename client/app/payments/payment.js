'use strict';

angular.module('convenienceApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('payment-loan-index', {
        url: '/payment/loan',
        templateUrl: 'app/payments/loan/index/loan-index.html',
        controller: 'LoanIndexCtrl',
        auth: true,
        data:{
          roles:['user']
        }
      }).state('payment-loan-apply', {
        url: '/payment/loan/apply',
        templateUrl: 'app/payments/loan/apply/loan-apply.html',
        controller: 'LoanApplyCtrl',
        auth: true,
        data:{
          roles:['user']
        }
      }).state('payment-loan-sign-contract', {
        url: '/payment/loan/signcontract',
        templateUrl: 'app/payments/loan/sign-contract/loan-sign-contract.html',
        controller: 'LoanSignContractCtrl',
        auth: true,
        data:{
          roles:['user']
        }
      }).state('payment-loan-payment', {
        url: '/payment/loan/payment',
        templateUrl: 'app/payments/loan/payment/loan-payment.html',
        controller: 'LoanPaymentCtrl',
        auth: true,
        data:{
          roles:['user']
        }
      }).state('payment-credit-card', {
        url: '/payment/creditcard',
        templateUrl: 'app/payments/credit-card/credit-card.html',
        controller: 'CreditCardCtrl',
        auth: true,
        data:{
          roles:['user']
        }
      });
  });