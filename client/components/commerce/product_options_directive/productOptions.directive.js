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
      templateUrl: 'components/commerce/product_options_directive/product_options.html',
      controller: 'ProductOptionsCtrl'
    };
  });