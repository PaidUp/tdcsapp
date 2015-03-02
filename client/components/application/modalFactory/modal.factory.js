'use strict';

angular.module('convenienceApp')
  .factory('ModalFactory', function ($rootScope, $modal) {

    var openModal = function (options) {
      $rootScope.modal = $modal.open(options);
    };
    return {
      PrivacyModal: function () {
        openModal({
          templateUrl: 'app/application/privacyPolicy/privacyModal.html',
          controller: 'PrivacyCtrl',
          size: 'lg'
        });
      },
      PrivacyAgreementModal: function () {
        openModal({
          templateUrl: 'app/application/privacyPolicy/privacyModalAgreement.html',
          controller: 'PrivacyCtrl',
          size: 'lg',
          backdrop: 'static',
          keyboard: false
        });
      },
      BoomModal: function () {
        openModal({
          templateUrl: 'app/application/boomAgreement/boomModal.html',
          controller: 'BoomCtrl',
          size: 'lg'
        });
      },
      ElectronicModal: function () {
        openModal({
          templateUrl: 'app/application/electronicCommunicationsAgreement/electronicAgreementModal.html',
          controller: 'ElectronicCtrl',
          size: 'lg'
        });
      },
      ContactUsModalConfirmation: function () {
        openModal({
          templateUrl: 'app/application/main/confirmationContactUsModal.html',
          controller: 'ContactUsCtrl',
          size: 'sm'
        });
      },
      ContactUsModal: function () {
        openModal({
          templateUrl: 'app/application/main/contactUsModal.html',
          controller: 'ContactUsCtrl',
          size: 'sm'
        });
      },
      PhoneAuthModal: function () {
        openModal({
          templateUrl: 'app/application/phoneAuthorization/phoneModal.html',
          controller: 'PhoneAuthCtrl',
          size: 'lg'
        });
      },
      TermsOfServiceModal: function () {
        openModal({
          templateUrl: 'app/application/termsOfService/termsModal.html',
          controller: 'TermsOfServiceCtrl',
          size: 'lg'
        });
      },
      CreateAthleteModal: function () {
        openModal({
          templateUrl: 'app/athletes/create/createAthleteModal.html',
          controller: 'CreateAthleteCtrl',
          size: 'sm'
        });
      },
      CreditReportAuthModal: function () {
        openModal({
          templateUrl: 'app/application/creditReportPullAuth/creditReportModal.html',
          controller: 'CreditReportAuthCtrl',
          size: 'lg'
        });
      },
      closeModal: function () {
        $rootScope.modal.dismiss('cancel');
      }
    };
  });