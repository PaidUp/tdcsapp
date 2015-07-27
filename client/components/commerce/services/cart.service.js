'use strict';

angular.module('convenienceApp')
  .service('CartService', function ($cookieStore, $resource, $q, $rootScope, encryptService, AuthService) {
    var Cart = $resource('/api/v1/commerce/cart/:action/:cartId',{
      cartId: ''
    },{});

    var CartService = this;
    $rootScope.$on('logout', function () {
      CartService.removeCurrentCart();
    });

    this.setCartDetails = function(team , prod){
      AuthService.getSessionSalt($cookieStore.get('token'), function(err, salt){
        if(err){
          console.log('getSessionSalt',err);
        }else{
          var els = new encryptService(salt);
          els.set('team', team);
          els.set('products', prod);
        }
      });
    }

    this.hasProductBySKU = function(sku, cb){
      AuthService.getSessionSalt($cookieStore.get('token'), function(err, salt){
        if(err){
          console.log('getSessionSalt',err);
        }else{
          var els = new encryptService(salt);
          var result = false;
          els.get('team').attributes.customOptions.forEach(function(ele, idx, arr){
            ele.forEach(function(option, idx2, arr2){
              option.values.forEach(function(value, idx3, arr3){
                if(value.sku == sku){
                  result = els.get('products').options[option.optionId] == value.valueId;
                }
              });
            });
          });
          cb(result);
        }
      });
    };

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

    this.addProductToCart = function (products, athlete) {
      var cartId = this.getCurrentCartId();
      var deferred = $q.defer();
      Cart.save({action: 'add'}, {
        cartId: cartId,
        products: products
      }).$promise.then(function (cart) {
        $cookieStore.put('userId', athlete._id);
        $cookieStore.put('athlete', athlete);
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
      $cookieStore.remove('team');
      AuthService.getSessionSalt($cookieStore.get('token'), function(err, salt){
        if(err){
          console.log('getSessionSalt',err);
        }else{
          var els = new encryptService(salt);
          els.remove('team');
          els.remove('products');
        }
      });



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

    this.getAthlete = function () {
      return $cookieStore.get('athlete');
    };

    var subTotal = 0;

    this.getSubtotal = function () {
      return subTotal;
    };

    this.calculatePrice = function (price, selectedCustomOptions, custionOptions) {
      var resp = Number(price);
      angular.forEach(selectedCustomOptions, function (selectedVal, selectedKey) {
        for (var option in custionOptions) {
          if (selectedKey === custionOptions[option].optionId) {
            for (var value in custionOptions[option].values) {
              if (selectedVal === custionOptions[option].values[value].valueId) {
                resp = resp + Number(custionOptions[option].values[value].price);
              }
            }
          }
        }
      });
      subTotal = resp;
      return resp;
    };

  });
