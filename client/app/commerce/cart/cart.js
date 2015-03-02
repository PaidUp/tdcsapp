'use strict';

angular.module('convenienceApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('cart', {
        url: '/commerce/cart/index',
        templateUrl: 'app/commerce/cart/index/cart.html',
        controller: 'CartCtrl',
        auth: true
      }).state('cart-review', {
        url: '/commerce/cart/review',
        templateUrl: 'app/commerce/cart/review/cartReview.html',
        controller: 'CartReviewCtrl',
        auth: true
      });
  });