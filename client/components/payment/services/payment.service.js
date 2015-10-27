'use strict';

angular.module('convenienceApp')
  .service('PaymentService', function ($resource) {

    var Payment = $resource('/api/v1/commerce/checkout/place', {}, {});
    var BankPayment = $resource('/api/v1/payment/bank/:action', {}, {});
    var DeleteBank = $resource('/api/v1/payment/bank/delete/:customerId/:bankId', {}, {});
    var CardPayment = $resource('/api/v1/payment/card/:action', {}, {});
    var CustomerPayment = $resource('/api/v1/payment/customer/:action', {}, {});

    this.sendPayment = function (payment) {
      return Payment.save(payment).$promise;
    };

    this.associateBankPayment = function (data) {
      return BankPayment.save({ action: 'associate' }, data).$promise;
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

    this.updateCustomer = function (dataCustomer) {
      return CustomerPayment.save({action: 'update'},dataCustomer).$promise;
    };
  });
