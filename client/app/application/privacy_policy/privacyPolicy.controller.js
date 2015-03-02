'use strict';

angular.module('convenienceApp')
  .controller('PrivacyCtrl', function ($scope, $state, ModalFactory, LoanService, FlashService) {
		var acceptedUser = {
			applicationId: LoanService.getLoanApplicationId(),
			state: 'ACCEPTED_CREDIT_CHECK'
		};

		var declinedUser = {
			applicationId: LoanService.getLoanApplicationId(),
			state: 'DENIED_CREDIT_CHECK'
		};

    $scope.sendAlertErrorMsg = function (msg) {
      FlashService.addAlert({
        type: 'danger',
        msg: msg,
        timeout: 10000
      });
    };

		$scope.modalFactory = ModalFactory;
    $scope.agree = function () {
			LoanService.setState(acceptedUser).then(function () {
        $scope.modalFactory.closeModal();
      }).catch(function (err) {
        $scope.sendAlertErrorMsg(err.data.message);
      });
    };

    $scope.decline = function () {
			LoanService.setState(declinedUser).then(function () {
        $state.go('cart');
        $scope.modalFactory.closeModal();
      }).catch(function (err) {
        $scope.sendAlertErrorMsg(err.data.message);
      });
    };
  });