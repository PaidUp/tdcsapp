'use strict';

angular.module('convenienceApp')
  .directive('facebookBtn', function () {
    return {
      restrict: 'E',
      replace: true,
      require: 'ngModel',
      templateUrl: 'components/auth/facebookDirective/facebookBtn.html',
      scope: {
        ngModel: '=ngModel'
      },
      controller: 'FacebookBtnCtrl'
    };
  });