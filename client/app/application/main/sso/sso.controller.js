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
      $state.go(AuthService.getDest());
      AuthService.setDest();
    });




  });
