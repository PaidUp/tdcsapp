'use strict';

angular.module('convenienceApp')
  .controller('MainCtrl', function ($rootScope, $scope, $timeout, FlashService, AuthService, ContactService,
                                    ModalService, ModalFactory, $anchorScroll, $location) {

    $rootScope.alerts = [];
    $scope.modalFactory = ModalFactory;
    $scope.modal = ModalService;

    $scope.destPath = function(value, isParent){
      AuthService.destPath(value, isParent);
    };

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
      AuthService.isLoggedInAsync(function(loggedIn) {
        $scope.user = angular.extend({}, AuthService.getCurrentUser());
        AuthService.resendEmail($scope.user._id);
      });
    };

    $scope.showContactUsForm = false;

    $scope.togggleForm = function(){
      $scope.showContactUsForm = !$scope.showContactUsForm;
    };

    $scope.solution = [true,true,true];

    $scope.showSolution = function(pos, val){
      $scope.solution[pos] = val;
    };

    $scope.goTo = function(path,anchor) {
      $location.path(path);
      if(anchor){
        $location.hash(anchor);
        $anchorScroll();
      }else{
        $location.hash('');
      }
    };

    $scope.toggleMenu = function(){
      $(".navbar-toggle").click();
    };

    AuthService.isLoggedInAsync(function (isLoggin) {
      if (isLoggin && $location.$$path === '/') {
        $location.path('/athletes/dashboard');
      }
    });
  });
