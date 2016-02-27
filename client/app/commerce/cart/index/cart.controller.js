'use strict';

angular.module('convenienceApp')
  .controller('CartCtrl', function ($rootScope, $scope, TeamService, CartService, $state, ModalFactory,
                                    CommerceService, NotificationEmailService, AuthService, FlashService, TrackerService, DuesService) {
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

    //var cartId = null;

    var getTotals = function (applyDiscountToFee, cb){
      CartService.getTotals($scope.cartId).then(function (totals) {
        angular.forEach(totals, function (total) {
          if(!total.amount){
            return handlerErrorGetTotals('Total is null');
          }
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

      }).catch(function(err){
        cb(err);
      }).finally(function(){
        if(!$scope.total || $scope.total === 0){
          return cb("Totals can't be set");
        }
        cb(null, true);
      });
    };

    CartController.loadSchedule = function(cb){
      var ele = CartController.cart.items[0];
      CartService.hasProductBySKU('PMINFULL', function(isInFullPay){
        CommerceService.getSchedule(ele.productId, CartService.getCartGrandTotal(), isInFullPay, CartService.getCartDiscount()).then(function (val) {
          if(val.error){
            $scope.isScheduleError = true;
            var user = AuthService.getCurrentUser();
            var bodyMessage = {
              productId:ele.productId,
              price:CartService.getCartGrandTotal(),
              isInFullPay: isInFullPay,
              name: user.firstName + ' ' + user.lastName,
              email: user.email
            }
            NotificationEmailService.sendNotificationEmail('Get schedule error', bodyMessage);
            cb(bodyMessage);
          }else{
            $scope.schedules.push({
              name: ele.name,
              periods: val.schedulePeriods
            });
            cb(null , true);
          }
        });
      });
    };

    CartController.generateDues = function(feeManagement, cb){
      DuesService.generateDues(feeManagement , function(err, data){

        if(err){
          cb(err);
        }else{
          cb(null, data)
        }
      });

    }

    $scope.modalFactory = ModalFactory;

    function getCart(){
      if ($scope.cartId) {
        $scope.teams = [];
        CartService.getCart($scope.cartId).then(function (cart) {
          var feeItem;
          CartController.cart = cart;
          angular.forEach(cart.items, function (cartItem, index) {
            TeamService.getTeam(cartItem.productId).then(function (team) {

              console.log('team**' , team);

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

              CartController.generateDues(JSON.parse(team.attributes.feeManagement) , function(err , data){
                console.log('err' , err);
                console.log('data' , data);
              });

            }).catch(function(err){
              handlerErrorGetTotals(err);
            }).finally(function(){

              $scope.schedules = [];
              $scope.totalPrice   = 0;

              getTotals(false, function(err, data){
                if(err){
                  return handlerErrorGetTotals(err);
                }
                CartController.loadSchedule(function(err, data){
                  if(err){
                    return handlerErrorGetTotals(err);
                  }

                  $scope.loading = false;
                });



              });
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
        CartService.applyDiscount($scope.codeDiscounts, $scope.cartId, function(err, data){
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
              if(err){
                return handlerErrorGetTotals(err);
              }
              CartController.loadSchedule(function(err, data){
                if(err){
                  return handlerErrorGetTotals(err);
                }
              });
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
