'use strict';

angular.module('convenienceApp')
  .directive('navBar', function () {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'components/application/nav_bar/nav_bar.html',
      controller: 'NavbarCtrl'
    };
  });