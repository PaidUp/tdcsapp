'use strict';

angular.module('convenienceApp')
  .directive('createCard', function () {
    return {
      restrict: 'E',
      scope: {
        user: '=',
        needZipcode: '='
      },
      templateUrl: 'components/payment/createCardDirective/createCard.html',
      controller: 'CreateCardCtrl'
    };
  });