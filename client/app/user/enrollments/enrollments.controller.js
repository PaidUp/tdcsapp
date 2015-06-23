'use strict';

angular.module('convenienceApp')
  .controller('EnrollmentsCtrl', function ($scope, $rootScope, CommerceService, FlashService, TeamService) {
    $rootScope.$emit('bar-welcome', {
      left:{
        url: 'app/user/templates/user-bar.html'
      } ,
      right:{
        url: ''
      }
    });
    $scope.loading = true;

    $scope.sendAlertErrorMsg = function (msg) {
      FlashService.addAlert({
        type: 'danger',
        msg: msg,
        timeout: 10000
      });
    };

    CommerceService.getOrders().then(function (orders) {
      if (orders.length === 0) {
        $scope.noEnrollments = true;
        $scope.loading = false;
        return;
      }
      $scope.orders = orders;
      angular.forEach($scope.orders, function (order) {
        TeamService.getTeam(order.products[0].productId).then(function (team) {
          order.isOpen = false;
          order.team = team;
          if (order.loan) {
            order.nextPaymentDate = $scope.getNextPaymentDate(order.loan.schedule);
            angular.forEach(order.loan.schedule, function (schedule) {
              schedule.installment = parseFloat(schedule.installment).toFixed(2);
            });
          }
          $scope.loading = false;
        });
      });
    }).catch(function (err) {
      $scope.noEnrollments = true;
      $scope.loading = false;
      $scope.sendAlertErrorMsg(err.data.message);
    });

    $scope.prettify = function (date) {
      return moment(date).format('MMMM DD, YYYY');
    };

    $scope.prettifyScheduleDate = function (date) {
      return moment(date).format('dddd MMMM DD, YYYY');
    };

    $scope.getGetOrdinal = function (n) {
      var s=['th','st','nd','rd'];
      var v=n%100;
      return n+(s[(v-20)%10]||s[v]||s[0]);
    };

    $scope.getNextPaymentDate = function (scheduleArray) {
      var date;
      var paymentNumber;
      var schedule;
      var hasPending;
      var isDelinquent = false;
      for (var i=0; i < scheduleArray.length; i++) {
        schedule = scheduleArray[i];
        if (schedule.state === 'failed') {
          isDelinquent = true;
          break;
        }
        if (schedule.state === 'pending') {
          hasPending = true;
          date = $scope.prettify(schedule.paymentDay);
          paymentNumber = $scope.getGetOrdinal(i + 1);
          break;
        }
      }
      if (hasPending) {
        return paymentNumber + ' payment ' + date;
      } else if (isDelinquent) {
        return 'None - Loan Delinquent';
      }else {
        return 'None - Loan Complete';
      }
    };
  });
