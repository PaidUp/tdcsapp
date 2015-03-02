'use strict';

angular.module('convenienceApp')
  .directive('navBar', function () {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'components/application/navBar/navBar.html',
      controller: 'NavbarCtrl'
    };
  });