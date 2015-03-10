'use strict';

angular.module('convenienceApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('payment-loan-index', {
        url: '/payment/loan',
        templateUrl: 'app/commerce/checkout/payments/loan/index/loan-index.html',
        controller: 'LoanIndexCtrl',
        auth: true
      }).state('payment-loan-apply', {
        url: '/payment/loan/apply',
        templateUrl: 'app/commerce/checkout/payments/loan/apply/loan-apply.html',
        controller: 'LoanApplyCtrl',
        auth: true
      }).state('payment-loan-sign-contract', {
        url: '/payment/loan/signcontract',
        templateUrl: 'app/commerce/checkout/payments/loan/sign-contract/loan-sign-contract.html',
        controller: 'LoanSignContractCtrl',
        auth: true
      }).state('payment-loan-payment', {
        url: '/payment/loan/payment',
        templateUrl: 'app/commerce/checkout/payments/loan/payment/loan-payment.html',
        controller: 'LoanPaymentCtrl',
        auth: true
      }).state('payment-credit-card', {
        url: '/payment/creditcard',
        templateUrl: 'app/commerce/checkout/payments/credit-card/credit-card.html',
        controller: 'CreditCardCtrl',
        auth: true
      });
  });