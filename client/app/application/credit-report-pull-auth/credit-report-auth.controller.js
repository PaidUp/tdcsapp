'use strict';

angular.module('convenienceApp')
  .controller('CreditReportAuthCtrl', function ($scope, ModalFactory) {
    $scope.modalFactory = ModalFactory;
  });