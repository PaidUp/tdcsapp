'use strict';

angular.module('convenienceApp')
  .controller('CartCtrl', function ($rootScope, $scope, TeamService, CartService, $state, ModalFactory) {
    $rootScope.$emit('bar-welcome', {
      left:{
        url: ''
      } ,
      right:{
        url: ''
      }
    });
    var cartId = CartService.getCurrentCartId();
    $scope.modalFactory = ModalFactory;
    if (cartId) {
      $scope.teams = [];
      CartService.getCart(cartId).then(function (cart) {
        var feeItem;
        angular.forEach(cart.items, function (cartItem, index) {
          TeamService.getTeam(cartItem.productId).then(function (team) {
            team.attributes.qty = cartItem.qty;
            if(team.attributes.productId === '9'){
              feeItem = team;
            }else{
              $scope.teams.push(team);
            }
            if (cart.items.length-1 === index){
              $scope.teams.push(feeItem);
            }
          });
        });
      });

      CartService.getTotals(cartId).then(function (totals) {
        angular.forEach(totals, function (total) {
          if (total.title === 'Grand Total') {
            $scope.total = total;
          } else if (total.title === 'Subtotal') {
            $scope.subtotal = total;
          }
        });
      });
    } else {
      $scope.hasCart = false;
    }

    // $scope.shipping = 0;
    // $scope.tax = 0;

    $scope.checkouOrder = function () {
      // $state.go('checkout');
      $state.go('payment-loan-index');
    };

    $scope.removeCart = function () {
      CartService.removeCurrentCart();
      $state.go('athletes');
      // CartService.createCart().then(function () {
      //   $state.go('athletes');
      // });
    };
  });