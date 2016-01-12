angular.module('convenienceApp')
  .controller('ScheduleListCtrl', function ($scope, $rootScope, scheduleService, UserService, $state, AuthService) {
    init()

  function init (){
  	console.log('init')
  	scheduleService.scheduleList({}).then(function(data){
  		//console.log('data', data)
  		$scope.paymentPlanLists = []
      
      data.paymentList.forEach(function(paymentPlan){
      	detailInfoFull(paymentPlan.entityId)	
      })
      
    }).catch(function(err){
      console.log('err', err);
    });
  }

  function detailInfoFull (id){
  	scheduleService.scheduleInfoFull(id).then(function(dataDetail){
  		$scope.paymentPlanLists.push(dataDetail.paymentList)
  		console.log('dataDetail', dataDetail)
  	}).catch(function(err){
      console.log('err', err);
    });
  }
  });