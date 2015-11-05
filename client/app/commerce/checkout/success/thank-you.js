'use strict';

angular.module('convenienceApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('thank-you', {
        url: '/commerce/checkout/success/:status',
        templateUrl: 'app/commerce/checkout/success/thank-you.html',
        auth: true,
        params : {
          status : 'old'
        },
        controller: function ($scope, $rootScope, $state, $stateParams) {
          if ($state.previous.name === 'payment-account-index' && $stateParams.status == 'new') {
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
