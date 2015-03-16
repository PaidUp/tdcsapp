'use strict';

angular.module('convenienceApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('thank-you', {
        url: '/commerce/checkout/success',
        templateUrl: 'app/commerce/checkout/success/thank-you.html',
        auth: true,
        controller: function ($scope, $rootScope, $state) {
          if ($state.previous.name === 'payment-loan-payment') {
            $scope.displayInfo = true;
          } else {
            $scope.displayInfo = false;
          }
          $rootScope.$emit('bar-welcome', {
            left:{
              url: ''
            } ,
            right:{
              url: ''
            }
          });
        }
      });
  });