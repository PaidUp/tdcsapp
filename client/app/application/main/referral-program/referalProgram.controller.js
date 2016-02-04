/**
 * Created by riclara on 12/18/15.
 */

'use strict';

angular.module('convenienceApp')
  .controller('ReferralProgramCtrl', function ($scope, ModalFactory, ModalParams) {

    $scope.modalFactory = ModalFactory;

    $scope.isModal = ModalParams.isModal;
    $scope.style = $scope.isModal ? 'modal-body' : 'container';

  });
