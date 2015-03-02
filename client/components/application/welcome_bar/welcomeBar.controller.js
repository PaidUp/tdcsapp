'use strict';

angular.module('convenienceApp')
  .controller('WelcomeBarCtrl', function ($scope, $rootScope) {
    $rootScope.$on('bar-welcome', function(event, args) {
      $scope.breadcrums = args.data || [];
      $scope.leftBar = args.left.url;
      $scope.rightBar = args.right.url;
    });
  });