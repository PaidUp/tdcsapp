/**
 * Created by riclara on 12/18/15.
 */

'use strict';

angular.module('convenienceApp')
  .controller('SSOCtrl', function ($scope, $state, $rootScope, $stateParams, $location, TrackerService, SessionService, $http, AuthService, UserService) {
    TrackerService.pageTrack();


    var data = {token:$stateParams.token};


    SessionService.addSession(data);
    UserService.get(data.token, function(user){
      $rootScope.currentUser = user;
      $location.path('/')
      if($stateParams.team){
        $location.path('/pn/'+$stateParams.team)
        if($stateParams.paymentPlan){
          $location.path('/pn/'+$stateParams.team+'/'+$stateParams.paymentPlan)
        }
      }
      console.log('$location.path', $location.path());
      $location.replace();

      //$state.go(AuthService.getDest());
      //AuthService.setDest();
    });




  });
