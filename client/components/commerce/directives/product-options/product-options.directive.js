'use strict';

angular.module('convenienceApp')
  .directive('customOptions', function () {
    return {
      restrict: 'E',
      require: 'ngModel',
      scope: {
        title: '=',
        type: '=',
        isrequired: '=',
        options: '=',
        ngModel: '='
      },
      templateUrl: 'components/commerce/directives/product-options/product-options.html',
      controller: 'ProductOptionsCtrl'
    };
  });