angular.module('convenienceApp')
  .controller('ScheduleCtrl', function ($scope, $rootScope, scheduleService, FlashService) {

    $scope.orderId = '100000275';

    $scope.search = function(){
      $scope.submitted = true;
      scheduleService.scheduleInfoFull($scope.orderId).then(function(data){
        $scope.submitted = false;
        if(!data || !data.paymentList || !data.paymentList.schedulePeriods){
          FlashService.addAlert({
            type: "warning",
            msg: "Order not found.",
            timeout: 10000
          });
          $scope.paymentPlan = {};
        }else{
          data.paymentList.schedulePeriods.forEach(function(ele , idx ,arr){
            ele.nextPaymentDue = new Date(ele.nextPaymentDue)
            ele.price = parseFloat(ele.price)
            ele.percent = parseFloat(ele.percent)
            ele.fee = parseFloat(ele.fee)
            ele.feePercent = parseFloat(ele.feePercent)
            ele.discountToFee = parseFloat(ele.discountToFee)
          });

          $scope.paymentPlan = data.paymentList;

        }
      }).catch(function(err){
        FlashService.addAlert({
          type: "danger",
          msg: "Can't be searched the order schedule, please contact us.",
          timeout: 10000
        });
      });
    }

    $scope.updatePeriod = function(period){
      $scope.submitted = true;
      scheduleService.scheduleInformationUpdate(period).then(function(resp){
        $scope.submitted = false;
        FlashService.addAlert({
          type: resp.data ? "success": "danger",
          msg: resp.data ? "Schedule period was updated success. " : "Schedule period wasn't be update. ",
          timeout: 10000
        });
        $scope.search();
      }).catch(function(err){
        $scope.submitted = false;
        FlashService.addAlert({
          type: "danger",
          msg: "Schedule period wasn't be update.",
          timeout: 10000
        });
      });

    }

    $scope.prepareCreate = function(option){
      $scope.scheduleNew = {}
      $scope.createPeriodSelected = option;
    }

    $scope.createPeriod = function(paymentPlanId, newPeriod){
      newPeriod.paymentPlanId = paymentPlanId
      $scope.submitted = true;
      scheduleService.scheduleInformationCreate(newPeriod).then(function(resp){
        $scope.submitted = false;
        FlashService.addAlert({
          type: resp.data ? "success": "danger",
          msg: resp.data ? "Schedule period was created success. " : "Schedule period wasn't be created. ",
          timeout: 10000
        });
        $scope.createPeriodSelected = false;
        $scope.search();
      }).catch(function(err){
        $scope.submitted = false;
        FlashService.addAlert({
          type: "danger",
          msg: "Schedule period wasn't be create.",
          timeout: 10000
        });
      });

    }


    $scope.deletePeriod = function(period){
      console.log('delete period' , period);

    }







  });
