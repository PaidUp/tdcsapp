'use strict';

angular.module('convenienceApp')
  .directive('facebookBtn', function () {
    return {
      restrict: 'E',
      replace: true,
      require: 'ngModel',
      templateUrl: 'components/auth/facebook_directive/facebook_btn.html',
      scope: {
        ngModel: '=ngModel'
      },
      controller: 'FacebookBtnCtrl'
    };
  });