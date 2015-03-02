'use strict';

angular.module('convenienceApp')
  .directive('welcomeBar', function () {
    return {
      templateUrl: 'components/application/welcome_bar/welcome_bar.html',
      restrict: 'E',
      controller: 'WelcomeBarCtrl'
    };
  });