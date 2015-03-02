'use strict';

angular.module('convenienceApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('payment-loan-index', {
        url: '/payment/loan',
        templateUrl: 'app/commerce/checkout/payments/loan/index/loanIndex.html',
        controller: 'LoanIndexCtrl',
        auth: true
      }).state('payment-loan-apply', {
        url: '/payment/loan/apply',
        templateUrl: 'app/commerce/checkout/payments/loan/apply/loanApply.html',
        controller: 'LoanApplyCtrl',
        auth: true
      }).state('payment-loan-sign-contract', {
        url: '/payment/loan/sign_contract',
        templateUrl: 'app/commerce/checkout/payments/loan/signContract/loanSignContract.html',
        controller: 'LoanSignContractCtrl',
        auth: true
      }).state('payment-loan-payment', {
        url: '/payment/loan/payment',
        templateUrl: 'app/commerce/checkout/payments/loan/payment/loanPayment.html',
        controller: 'LoanPaymentCtrl',
        auth: true
      }).state('payment-credit-card', {
        url: '/payment/creditcard',
        templateUrl: 'app/commerce/checkout/payments/creditCard/creditCard.html',
        controller: 'CreditCardCtrl',
        auth: true
      });
  });