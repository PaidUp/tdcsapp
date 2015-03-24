'use strict';

angular.module('convenienceApp')
  .service('CartService', function ($cookieStore, $resource, $q, $rootScope) {
    var Cart = $resource('/api/v1/commerce/cart/:action/:cartId',{
      cartId: ''
    },{});

    var CartService = this;
    $rootScope.$on('logout', function () {
      CartService.removeCurrentCart();
    });

    this.createCart = function() {
      var deferred = $q.defer();
      var CartService = this;
      // var currentcartId = $cookieStore.get('cartId');
      // if (currentcartId) {
      //   return CartService.getCart(currentcartId);
      // }
      Cart.get({action: 'create'}).$promise.then(function (response) {
        CartService.getCart(response.cartId).then(function (cart) {
          $cookieStore.remove('userId');
          $rootScope.$emit('event:cart-state-changed', cart);
          deferred.resolve(cart);
        }).catch(function (err) {
          deferred.reject(err);
        });
        $cookieStore.put('cartId', response.cartId);
      }).catch(function (err) {
        deferred.reject(err);
      });
      return deferred.promise;
    };

    this.addProductToCart = function (products, userId) {
      var cartId = this.getCurrentCartId();
      var deferred = $q.defer();

      Cart.save({action: 'add'}, {
        cartId: cartId,
        products: products
      }).$promise.then(function (cart) {
        $cookieStore.put('userId', userId);
        $rootScope.$emit('event:cart-state-changed', undefined);
        deferred.resolve(cart);
      }).catch(function (err) {
        deferred.reject(err);
      });
      return deferred.promise;
    };

    this.removeCurrentCart = function() {
      $cookieStore.remove('cartId');
      $cookieStore.remove('userId');
      $rootScope.$emit('event:cart-state-changed', undefined);
    };

    this.getCurrentCartId = function () {
      return $cookieStore.get('cartId');
    };

    this.getCart = function (cartId) {
      return Cart.get({
        action: 'view',
        cartId: cartId.cartId
      }).$promise;
      // return $cookieStore.get('cartId');
    };

    this.getTotals = function (cartId) {
      return Cart.query({
        action: 'totals',
        cartId: cartId.cartId
      }).$promise;
    };

    this.getUserId = function () {
      return $cookieStore.get('userId');
    };
  });