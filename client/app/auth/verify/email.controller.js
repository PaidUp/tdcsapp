'use strict';

angular.module('convenienceApp')
  .controller('EmailCtrl', function ($scope, $stateParams, AuthService, $state, FlashService, $rootScope) {
    if ($stateParams.token) {
      AuthService.verifyEmailToken($stateParams.token, function(){
          AuthService.updateCurrentUser();
          $state.go('athletes', {}, { location: true, reload: true, inherit: false, notify: true });
          $rootScope.$emit('close-alerts');
          FlashService.addAlert({
            type: 'success',
            templateUrl:'components/application/directives/alert/alerts/verify-email-success.html',
            timeout: 10000
          });
        },
        function(err){
          FlashService.addAlert({
            type: 'danger' ,
            msg: err.message,
            timeout: 10000
          });
          $state.go('athletes');
        });
    }
  });
