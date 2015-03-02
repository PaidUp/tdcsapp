'use strict';

angular.module('convenienceApp')
  .directive('alerts', function () {
    return {
      templateUrl: 'components/application/alertDirective/alertDirective.html',
      restrict: 'E'
    };
  });