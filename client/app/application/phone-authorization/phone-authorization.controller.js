'use strict';

angular.module('convenienceApp')
  .controller('PhoneAuthCtrl', function ($scope, ModalFactory) {
    $scope.modalFactory = ModalFactory;
  });