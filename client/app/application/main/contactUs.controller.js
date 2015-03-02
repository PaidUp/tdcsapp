'use strict';

angular.module('convenienceApp')
  .controller('ContactUsCtrl', function ($scope, ModalFactory, ContactService) {
    $scope.modalFactory = ModalFactory;

    $scope.contactUs = function () {
      $scope.submitted = true;
      if ($scope.contactUsForm.$valid) {
        ContactService.contactUs($scope.contactInfo);
        $scope.modalFactory.closeModal();
        $scope.modalFactory.ContactUsModalConfirmation();
        $scope.contactUsForm.$setPristine();
      }
    };
  });