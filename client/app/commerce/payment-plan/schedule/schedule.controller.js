angular.module('convenienceApp')
  .controller('ScheduleCtrl', function ($scope, $rootScope, scheduleService, FlashService, CommerceService) {

    $scope.orderId = '';
    $scope.scheduleNew = {isCharged : false};

    $scope.search = function(orderId){
      CommerceService.getOrder(orderId).then(function(order){
        $scope.order = order;
        search(orderId);
      }).catch(function(err){
        FlashService.addAlert({
          type: "danger",
          msg: "Can't be searched the order schedule, please contact us.",
          timeout: 10000
        });
      });
    }

    $scope.updatePeriod = function(orderId, period){
      $scope.submitted = true;
      if(validatePeriod(period)){
        scheduleService.scheduleInformationUpdate(period).then(function(resp){
          $scope.submitted = false;
          FlashService.addAlert({
            type: resp.data ? "success": "danger",
            msg: resp.data ? "Schedule period was updated success. " : "Schedule period wasn't be update. ",
            timeout: 10000
          });
          $scope.search(orderId);
        }).catch(function(err){
          $scope.submitted = false;
          FlashService.addAlert({
            type: "danger",
            msg: "Schedule period wasn't be update.",
            timeout: 10000
          });
        });
      }
    }

    $scope.deactivatePeriod = function(orderId, period){
      period.status = "deactivate"
      period.isCharged = true
      $scope.updatePeriod(orderId, period);
    }

    $scope.activatePeriod = function(orderId, period){
      period.status = "activate"
      $scope.updatePeriod(orderId, period);
    }

    $scope.createPeriod = function(orderId, paymentPlanId, newPeriod){
      if(validatePeriod(newPeriod)){
        newPeriod.paymentPlanId = paymentPlanId
        $scope.submitted = true;
        scheduleService.scheduleInformationCreate(newPeriod).then(function(resp){
          $scope.submitted = false;
          FlashService.addAlert({
            type: resp.data ? "success": "danger",
            msg: resp.data ? "Schedule period was created success. " : "Schedule period wasn't be created. ",
            timeout: 10000
          });
          $scope.search(orderId);
        }).catch(function(err){
          $scope.submitted = false;
          FlashService.addAlert({
            type: "danger",
            msg: "Schedule period wasn't be create.",
            timeout: 10000
          });
        });
      }
    }

    $scope.clearNewPeriod = function(){
      $scope.scheduleNew = {isCharged : false};
    }

    $scope.getStatusName = function(isCharged, status){
      console.log('status' , status)
      return scheduleService.getStatusPeriod(isCharged, status);
    }

    function search(orderId) {
      $scope.submitted = true;
      $scope.clearNewPeriod();
      scheduleService.scheduleInfoFull(orderId).then(function(data){
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

    function validatePeriod(period){
      var resp = true;

      if(!period.price){
        resp = false;
      }
      else if(!period.nextPaymentDue){
        resp = false;
      }
      else if(!period.description){
        resp = false;
      }

      if(!resp){
        FlashService.addAlert({
          type: "danger",
          msg: "All fields are required.",
          timeout: 10000
        });
        $scope.submitted = false;
      }

      return resp;

    }


  });
