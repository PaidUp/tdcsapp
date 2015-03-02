'use strict';

angular.module('convenienceApp')
  .controller('EmailCtrl', function ($scope, $stateParams, AuthService, $state, FlashService, $rootScope) {
    if ($stateParams.token) {
      AuthService.verifyEmailToken($stateParams.token, function(){
        $rootScope.$emit('close-alerts');
        AuthService.updateCurrentUser();
        $state.go('main', {}, { location: true, reload: true, inherit: false, notify: true });
        FlashService.addAlert({
          type: 'success',
          templateUrl:'components/application/alert_directive/alerts/verify_email_success.html',
          timeout: 10000
        });
      },
      function(err){
        FlashService.addAlert({
          type: 'danger' ,
          msg: err.message,
          timeout: 10000
        });
        $state.go('main');
      });
    }
  });