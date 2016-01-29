angular.module('convenienceApp')
  .controller('ScheduleCtrl', function ($scope, $rootScope, scheduleService, FlashService, UserService, $state, AuthService) {

    $scope.orderId = '100000275';

    $scope.search = function(){
      $scope.submitted = true;
      scheduleService.scheduleInfoFull($scope.orderId).then(function(data){
        if(!data || !data.paymentList){
          FlashService.addAlert({
            type: "warning",
            msg: "Order not found.",
            timeout: 10000
          });
        }else{

          data.paymentList.schedulePeriods.forEach(function(ele , idx ,arr){
            console.log('next payment due : ' , ele.nextPaymentDue);
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
        console.log('err', err);
      });

    }



    function init (){
  	console.log('init')
  	scheduleService.scheduleList({}).then(function(data){
  		console.log('data.paymentList.length', data.paymentList.length)
  		$scope.paymentPlanLists = [];

      data.paymentList.forEach(function(paymentPlan){
      	detailInfoFull(paymentPlan.entityId);
      });

    }).catch(function(err){
      console.log('err', err);
    });
  }

  function detailInfoFull (id){
  	scheduleService.scheduleInfoFull(id).then(function(dataDetail){
  		$scope.paymentPlanLists.push(dataDetail.paymentList);
  		console.log('dataDetail', dataDetail);
  	}).catch(function(err){
      console.log('err', err);
    });
  }

    //init();

  });
