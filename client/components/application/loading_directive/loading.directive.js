'use strict';

angular.module('convenienceApp')
  .directive('loading', function () {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'components/application/loading_directive/loading.html'
    };
  });