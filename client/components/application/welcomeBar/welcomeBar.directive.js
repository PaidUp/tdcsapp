'use strict';

angular.module('convenienceApp')
  .directive('welcomeBar', function () {
    return {
      templateUrl: 'components/application/welcomeBar/welcomeBar.html',
      restrict: 'E',
      controller: 'WelcomeBarCtrl'
    };
  });