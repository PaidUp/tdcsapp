'use strict';

angular.module('convenienceApp')
  .controller('FacebookBtnCtrl', function ($scope, $rootScope, FlashService, AuthService, $state, ModalService) {
    $scope.modal = ModalService;
    $scope.facebookLogin = function() {
      var success = function(user) {
        $scope.modal.closeModal();
        $state.go(AuthService.getDest());
        AuthService.setDest();
      };
      var error = function(err) {
        console.log(err);
      };
      AuthService.loginFacebook(success, error);
    };
  });