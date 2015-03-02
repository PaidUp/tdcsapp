'use strict';

angular.module('convenienceApp')
  .directive('footerBar', function () {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'components/application/footerBar/footerBar.html'
    };
  });