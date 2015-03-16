'use strict';

angular.module('convenienceApp')
  .controller('CartReviewCtrl', function ($rootScope, $scope, $state, TeamService, CartService) {
    $rootScope.$emit('bar-welcome', {
      left:{
        url: ''
      } ,
      right:{
        url: ''
      }
    });
    $scope.cart = CartService.getCurrentCart();
    $scope.requiredItems = TeamService.getRequiredItems($scope.cart.team._id);
    // $scope.requiredItems = TeamService.getRequiredItems($scope.cart.team.product_id);

    $scope.addToCart = function () {
      if ($scope.cartForm.$valid) {
        $scope.cart.team.requiredItems = $scope.requiredItems;
        delete $scope.cart.team.requiredItems.sizes;
        CartService.createCart($scope.cart);
        $state.go('cart');
      }
    };
  });