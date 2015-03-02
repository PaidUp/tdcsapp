'use strict';

angular.module('convenienceApp')
  .controller('ElectronicCtrl', function ($scope, ModalFactory) {
    $scope.modalFactory = ModalFactory;
  });