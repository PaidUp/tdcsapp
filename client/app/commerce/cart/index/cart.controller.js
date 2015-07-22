'use strict';

angular.module('convenienceApp')
  .controller('CartCtrl', function ($rootScope, $scope, TeamService, CartService, $state, ModalFactory, CommerceService) {
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
            team.attributes.price = cartItem.price;
            team.attributes.rowTotal = cartItem.rowTotal;
            if(team.attributes.productId === '9'){
              feeItem = team;
            }else{
              $scope.teams.push(team);
            }
            if (cart.items.length-1 === index && typeof(feeItem) !== 'undefined'){
              $scope.teams.push(feeItem);
            }
          });
        });
      });

      $scope.schedules = [];
      $scope.totalPrice   = 0;

      var currentCartId = CartService.getCurrentCartId();
      CartService.getCart(currentCartId).then(function (value) {
        var products = value.items;
        products.forEach(function (ele, idx, arr) {
          var isInFullPay = CartService.hasProductBySKU('PMINFULL');
          CommerceService.getSchedule(ele.productId, ele.price, isInFullPay).then(function (val) {
            $scope.schedules.push({
              name: ele.name,
              periods: val.schedulePeriods
            });
            val.schedulePeriods.forEach(function(ele, idx, arr){
              $scope.totalPrice += parseFloat(ele.price) ;
            });
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
      $state.go('payment-credit-card');
    };

    $scope.removeCart = function () {
      CartService.removeCurrentCart();
      $state.go('athletes');
      // CartService.createCart().then(function () {
      //   $state.go('athletes');
      // });
    };
  });
