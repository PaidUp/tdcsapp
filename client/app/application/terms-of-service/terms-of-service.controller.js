'use strict';

angular.module('convenienceApp')
  .controller('TermsOfServiceCtrl', function ($scope, ModalFactory) {
    $scope.modalFactory = ModalFactory;
  });