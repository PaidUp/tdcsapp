'use strict';

angular.module('convenienceApp')
  .directive('createCard', function () {
    return {
      restrict: 'E',
      scope: {
        user: '=',
        needZipcode: '='
      },
      templateUrl: 'components/payment/directives/create-card/create-card.html',
      controller: 'CreateCardCtrl'
    };
  });