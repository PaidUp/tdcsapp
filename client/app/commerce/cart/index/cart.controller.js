'use strict';

angular.module('convenienceApp')
  .controller('CartCtrl', function ($rootScope, $scope, TeamService, CartService, $state, ModalFactory,
                                    CommerceService, NotificationEmailService, AuthService, FlashService, TrackerService) {
    $rootScope.$emit('bar-welcome', {
      left:{
        url: ''
      } ,
      right:{
        url: ''
      }
    });

    $rootScope.$emit('init-cart-service' , {});

    var CartController = this;

    var cartId = CartService.getCurrentCartId();

    var getTotals = function (applyDiscountToFee, cb){
      CartService.getTotals(cartId).then(function (totals) {
        angular.forEach(totals, function (total) {
          if (total.title === 'Grand Total') {
            $scope.total = total;
            CartService.setCartGrandTotal(total.amount);
          } else if (total.title === 'Subtotal') {
            $scope.subtotal = total;
          } else if (total.title.indexOf("Discount")===0) {
            $scope.discount = total;
            if(applyDiscountToFee){
              CartService.setCartDiscount(total.amount * -1);
            }
          }
        });
        cb(null, true);
      }).catch(function(err){
        cb(err);
      });
    };

    CartController.loadSchedule = function(){
      var ele = CartController.cart.items[0];
      CartService.hasProductBySKU('PMINFULL', function(isInFullPay){
        CommerceService.getSchedule(ele.productId, CartService.getCartGrandTotal(), isInFullPay, CartService.getCartDiscount()).then(function (val) {
          if(val.error){
            var user = AuthService.getCurrentUser();
            $scope.isScheduleError = true;
            NotificationEmailService.sendNotificationEmail('Get schedule error', {
              productId:ele.productId,
              price:CartService.getCartGrandTotal(),
              isInFullPay: isInFullPay,
              name: user.firstName + ' ' + user.lastName,
              email: user.email
            });
          }else{
            $scope.schedules.push({
              name: ele.name,
              periods: val.schedulePeriods
            });
          }
        });
      });
    };

    $scope.modalFactory = ModalFactory;
    if (cartId) {
      $scope.teams = [];
      CartService.getCart(cartId).then(function (cart) {
        var feeItem;
        CartController.cart = cart;
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

        $scope.schedules = [];
        $scope.totalPrice   = 0;

        getTotals(false, function(err, data){
          CartController.loadSchedule();
        });

      });
    } else {
      $scope.hasCart = false;
    }

    // $scope.shipping = 0;
    // $scope.tax = 0;

    $scope.checkouOrder = function () {
      TrackerService.create('Checkou Order');
      // $state.go('checkout');
      $state.go('payment-credit-card');
    };

    $scope.removeCart = function () {
      TrackerService.create('Remove cart');
      CartService.removeCurrentCart();
      $state.go('athletes');
      // CartService.createCart().then(function () {
      //   $state.go('athletes');
      // });
    };

    $scope.codeDiscounts = '';

    $scope.applyDiscount = function(){
      if(!$scope.codeDiscounts.trim().length){
        TrackerService.create('Apply discount error',{errorMessage : 'Discount code is required'});
        FlashService.addAlert({
          type: 'danger',
          msg: 'Discount code is required',
          timeout: 10000
        });
      }else{
        CartService.applyDiscount($scope.codeDiscounts, cartId, function(err, data){
          if(err){
            TrackerService.create('Apply discount error' , {errorMessage : 'Coupon in not valid'});
            FlashService.addAlert({
              type: 'danger',
              msg: 'Coupon is not valid',
              timeout: 10000
            });
          } else{
            TrackerService.create('Apply discount success',{coupon : $scope.codeDiscounts});
            $scope.schedules = [];
            getTotals($scope.codeDiscounts.indexOf('CS-') === 0, function(err,data){
              CartController.loadSchedule();
            });
          }
        });
      }
    }
  });
