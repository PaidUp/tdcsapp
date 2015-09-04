'use strict';

angular.module('convenienceApp')
  .controller('NavbarCtrl', function ($scope, $rootScope, $state, AuthService, CartService) {

    $scope.menu = [{
      'title': 'Home',
      'link': '/'
    }];
    $scope.isLoggedIn = function(){
      return AuthService.isLoggedIn();
    };

    $scope.isUser = function(){
      return AuthService.isUser();
    };

    $scope.getCart = function () {
      if ( $scope.isLoggedIn() ) {
        var cartId = CartService.getCurrentCartId();
        if (cartId) {
          CartService.getCart(cartId).then(function (cart) {
            $scope.itemCount = cart.items.length || 0;
          });
        } else {
          $scope.itemCount = 0;
        }
      }
    };

    $scope.getCart();

    $rootScope.$on('event:cart-state-changed', function (event, cart) {
      if (angular.isDefined(cart)) {
        $scope.itemCount = cart.items.length;
      } else {
        $scope.getCart();
      }
    });

    $scope.logout = function() {
      AuthService.logout();
      $rootScope.$emit('logout', {});
      $scope.itemCount = 0;
      $rootScope.$emit('bar-welcome', {
        left:{
          url: ''
        } ,
        right:{
          url: ''
        }
      });
      $state.go('main');
    };

    $scope.isActive = function(route) {
      return route === $state.path();
    };
  });
