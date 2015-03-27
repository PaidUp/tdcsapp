'use strict';

angular.module('convenienceApp')
  .service('PaymentService', function ($resource) {

    var Payment = $resource('/api/v1/commerce/checkout/place', {}, {});
    var BankPayment = $resource('/api/v1/payment/bank/:action', {}, {});
    var DeleteBank = $resource('/api/v1/payment/bank/delete/:customerId/:bankId', {}, {});
    var CardPayment = $resource('/api/v1/payment/card/:action', {}, {});

    this.sendPayment = function (payment) {
      console.log('payment', payment);
      return Payment.save(payment).$promise;
    };

    this.createBankPayment = function (payment) {
      return BankPayment.save({ action: 'create' }, payment).$promise;
    };

    this.listBankAccounts =  function () {
      return BankPayment.get({ action: 'list' }).$promise;
    };

    this.getBankAccount = function (bankId) {
      return BankPayment.get({ action: bankId }).$promise;
    };

    this.deleteBankAccount = function (customerId, bankId) {
      return DeleteBank.get({ customerId: customerId, bankId: bankId }).$promise;
    };

    this.verifyBankAccount = function (bankInfo) {
      return BankPayment.save({ action: 'verify' }, bankInfo).$promise;
    };

    this.listCards =  function () {
      return CardPayment.get({ action: 'list' }).$promise;
    };

    this.getCard = function (cardId) {
      return CardPayment.get({ action: cardId }).$promise;
    };

    var CardService = $resource('/api/v1/payment/card/associate', {}, {});
    this.associateCard = function (cardId) {
      return CardService.save({cardId: cardId}).$promise;
    };
  });