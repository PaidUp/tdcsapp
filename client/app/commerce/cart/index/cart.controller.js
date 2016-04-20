'use strict';

angular.module('convenienceApp')
  .controller('CartCtrl', function ($rootScope, $scope, TeamService, CartService, $state, ModalFactory,
                                    CommerceService, NotificationEmailService, AuthService, FlashService, TrackerService,
                                    DuesService) {
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

    CartController.generateDues = function(applyDiscount, couponId, discount){
      try{
        var fm = CartService.getFeeManagement();
        var ro = CartService.getOrderRequest();
        if(applyDiscount){
          ro.discount = discount;
          ro.couponId = couponId;
        }else{
          ro.discount = 0;
          ro.couponId = "";
        }
        CartService.setOrderRequest(ro);

        $scope.totals = {
          discount : 0,
          subTotal : 0,
          grandTotal : 0
        }

        var dues = fm.paymentPlans[fm.paymentPlanSelected].dues;
        $scope.dues = [];

        var params = [];

        dues.forEach(function(ele, idx, arr){
          if(applyDiscount) {
            ele.applyDiscount = true;
            ele.discount = discount;
            ele.couponId = couponId
          }

          params.push({
            originalPrice: ele.amount,
            stripePercent: fm.processingFees.cardFeeDisplay,
            stripeFlat: fm.processingFees.cardFeeFlatDisplay,
            paidUpFee: fm.collectionsFee.fee,
            discount: ele.applyDiscount ? ele.discount : 0,
            payProcessing: fm.paysFees.processing,
            payCollecting: fm.paysFees.collections,
            description : ele.description,
            dateCharge : evalDate(ele.dateCharge)
          });

        });
        DuesService.calculateDues(params, function(err, data){
          if(err){
            $scope.duesError = true;
            TrackerService.create('Error calculating Dues' , err)
            $scope.loading = false;
            return handlerErrorGetTotals(err)
          }
          $scope.duesError = false;
          $scope.dues = data.prices;
          CartService.setDues(data.prices);

          data.prices.forEach(function(price, idx, arr){
            $scope.totals.subTotal = $scope.totals.subTotal + (price.owedPrice + price.discount);
            $scope.totals.discount = $scope.totals.discount + price.discount;
          });
          $scope.totals.grandTotal = $scope.totals.subTotal - $scope.totals.discount;
        });

        CartService.setFeeManagement(fm);

      }catch(err){
        $scope.duesError = true;
        $scope.loading = false;
        TrackerService.create('Error parse JSON dues' , {feeManagement : feeManagement});
        return cb(err);
      }
    };

    function evalDate(strDate){
      var result = "";
      var orgDate = new Date(strDate);
      var today = new Date();
      if(orgDate.getTime() < today.getTime()){
        result = today.toLocaleDateString('fr-CA');
      }else{
        result = strDate
      }
      return result;
    }

    $scope.modalFactory = ModalFactory;

    function getCart(){
      if ($scope.cartId) {
        $scope.teams = [];
        CartService.getCart($scope.cartId).then(function (cart) {
          var feeItem;
          CartController.cart = cart;
          angular.forEach(cart.items, function (cartItem, index) {
            $scope.productId = cartItem.productId;

            TeamService.getTeam(cartItem.productId).then(function (team) {

              team.attributes.qty = cartItem.qty;
              team.attributes.price = cartItem.price;
              team.attributes.rowTotal = cartItem.rowTotal;
              CartService.setTeam(team)
              if(team.attributes.productId === '9'){
                feeItem = team;
              }else{
                $scope.teams.push(team);
              }
              if (cart.items.length-1 === index && typeof(feeItem) !== 'undefined'){
                $scope.teams.push(feeItem);
              }

            }).catch(function(err){
              handlerErrorGetTotals(err);
            }).finally(function(){
              CartController.generateDues(false);
              $scope.loading= false;
            });
          });
        }).catch(function(err){
          handlerErrorGetTotals(err);
        }).finally(function(){

        });
      } else {
        $scope.hasCart = false;
        $scope.loading= false;
      }
    }

    function handlerErrorGetTotals(err){
      TrackerService.create('Error get totals',{errorMessage : JSON.stringify(err)});
      FlashService.addAlert({
        type: "danger",
        msg: "We had a problem and have notified our team.  We will contact you shortly once it’s resolved.",
        timeout: 10000
      });
      $state.go('athletes');
      $scope.loading=false;
      return false;
    }

    $scope.checkouOrder = function () {
      TrackerService.create('Checkou Order');
      $state.go('payment-account-index');
    };

    $scope.removeCart = function () {
      TrackerService.create('Remove cart');
      CartService.removeCurrentCart();
      $state.go('athletes');
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
        CartService.applyDiscount($scope.productId, $scope.codeDiscounts, function(err, data){
          if(err){
            TrackerService.create('Apply discount error' , {errorMessage : 'Coupon in not valid'});
            FlashService.addAlert({
              type: 'danger',
              msg: 'Coupon is not valid',
              timeout: 10000
            });
          } else{
            TrackerService.create('Apply discount success',{coupon : $scope.codeDiscounts});
            CartController.generateDues(true, data._id, data.percent);
            FlashService.addAlert({
              type: 'success',
              msg: 'Your discount was applied',
              timeout: 5000
            });

          }
        });
      }
    }

    $scope.init = function(){
      $scope.cartId = CartService.getCurrentCartId();
      $scope.loading= true;
      getCart();
    }
  });
