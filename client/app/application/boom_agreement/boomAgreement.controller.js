'use strict';

angular.module('convenienceApp')
  .controller('BoomCtrl', function ($scope, ModalFactory) {
    $scope.modalFactory = ModalFactory;
  });