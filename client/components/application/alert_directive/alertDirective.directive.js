'use strict';

angular.module('convenienceApp')
  .directive('alerts', function () {
    return {
      templateUrl: 'components/application/alert_directive/alert_directive.html',
      restrict: 'E'
    };
  });