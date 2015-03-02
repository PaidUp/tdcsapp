'use strict';

angular.module('convenienceApp')
  .service('CommerceService', function ($cookieStore, $resource, $q, $rootScope) {
    var Orders = $resource('/api/v1/commerce/order/list', {}, {});
    var Transactions = $resource('/api/v1/commerce/transaction/list', {}, {});

    this.getOrders = function () {
      return Orders.query().$promise;
    };

    this.getUsertransactions = function () {
      return Transactions.query().$promise;
    };
  });