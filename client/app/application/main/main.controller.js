'use strict';

angular.module('convenienceApp')
  .controller('MainCtrl', function ($rootScope, $scope, $timeout, FlashService, AuthService, ContactService, ModalService, ModalFactory) {

    $rootScope.alerts = [];
    $scope.modalFactory = ModalFactory;
    $scope.modal = ModalService;

    $scope.$on('event:alerts', function () {
      var alert = FlashService.shift();
      if (alert.timeout) {
        $rootScope.alerts.push(alert);
        $timeout(function () {
          angular.forEach($rootScope.alerts, function (value, index) {
            if (value.templateUrl === alert.templateUrl) {
              $scope.closeAlert(index);
            }
          });
        }, alert.timeout);
      } else {
        var exist = false;
        angular.forEach($rootScope.alerts, function (value) {
          if (value.templateUrl === alert.templateUrl) {
            exist = true;
          }
        });
        if (!exist) {
          $rootScope.alerts.push(alert);
        }
      }
    });

    $rootScope.$on('logout', function () {
      $rootScope.alerts = [];
    });

    $rootScope.$on('close-alerts', function () {
      $rootScope.alerts = [];
    });

    $scope.closeAlert = function(index) {
      $rootScope.alerts.splice(index, 1);
    };
    $scope.resendEmail = function(){
      AuthService.resendEmail();
    };

    $scope.contactUs = function (form, contactInfo) {
      $scope.submitted = true;
      if (form.$valid) {
        ContactService.contactUs(contactInfo);
        $scope.modalFactory.ContactUsModalConfirmation();
        document.getElementById('contactUsForm').reset();
      }
    };
  });