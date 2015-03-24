'use strict';

angular.module('convenienceApp')
  .controller('LoanIndexCtrl', function ($rootScope, $scope, CartService, TeamService, $state, LoanService, FlashService) {
    $rootScope.$emit('bar-welcome', {
      left:{
        url: 'app/payments/templates/loan-bar.html'
      } ,
      right:{
        url: ''
      }
    });

    $scope.sendAlertErrorMsg = function (msg) {
      FlashService.addAlert({
        type: 'danger',
        msg: msg,
        timeout: 10000
      });
    };

    var cartId = CartService.getCurrentCartId();
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
      }).catch(function (err) {
        $scope.sendAlertErrorMsg(err.data.message);
        $state.go('cart');
      });

      CartService.getTotals(cartId).then(function (totals) {
        angular.forEach(totals, function (total) {
          if (total.title === 'Grand Total') {
            $scope.total = total;
            LoanService.getLoanSimulation({
              amount: total.amount,
              numberPayments: 6
            }).then(function (simulationData) {
              $scope.paymentPlan = {
                loanAmount: simulationData.amount,
                monthlyPayment: simulationData.installments[0].installment,
                term: '6 months',
                apr: simulationData.interestRate + '%'
              };
            });
          } else if (total.title === 'Subtotal') {
            $scope.subtotal = total;
          }
        });
      }).catch(function (err) {
        $scope.sendAlertErrorMsg(err.data.message);
        $state.go('cart');
      });

    } else {
      $scope.noCart = true;
      $state.go('cart');
    }
  });