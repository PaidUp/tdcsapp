'use strict';

angular.module('convenienceApp')
  .factory('ModalFactory', function ($rootScope, $modal) {

    var openModal = function (options) {
      $rootScope.modal = $modal.open(options);
    };
    return {
      PrivacyModal: function () {
        openModal({
          templateUrl: 'app/application/privacy_policy/privacy_modal.html',
          controller: 'PrivacyCtrl',
          size: 'lg'
        });
      },
      PrivacyAgreementModal: function () {
        openModal({
          templateUrl: 'app/application/privacy_policy/privacy_modal_agreement.html',
          controller: 'PrivacyCtrl',
          size: 'lg',
          backdrop: 'static',
          keyboard: false
        });
      },
      BoomModal: function () {
        openModal({
          templateUrl: 'app/application/boom_agreement/boom_modal.html',
          controller: 'BoomCtrl',
          size: 'lg'
        });
      },
      ElectronicModal: function () {
        openModal({
          templateUrl: 'app/application/electronic_communications_agreement/electronic_agreement_modal.html',
          controller: 'ElectronicCtrl',
          size: 'lg'
        });
      },
      ContactUsModalConfirmation: function () {
        openModal({
          templateUrl: 'app/application/main/confirmation_contact_us_modal.html',
          controller: 'ContactUsCtrl',
          size: 'sm'
        });
      },
      ContactUsModal: function () {
        openModal({
          templateUrl: 'app/application/main/contact_us_modal.html',
          controller: 'ContactUsCtrl',
          size: 'sm'
        });
      },
      PhoneAuthModal: function () {
        openModal({
          templateUrl: 'app/application/phone_authorization/phone_modal.html',
          controller: 'PhoneAuthCtrl',
          size: 'lg'
        });
      },
      TermsOfServiceModal: function () {
        openModal({
          templateUrl: 'app/application/terms_of_service/terms_modal.html',
          controller: 'TermsOfServiceCtrl',
          size: 'lg'
        });
      },
      CreateAthleteModal: function () {
        openModal({
          templateUrl: 'app/athletes/create/create_athlete_modal.html',
          controller: 'CreateAthleteCtrl',
          size: 'sm'
        });
      },
      CreditReportAuthModal: function () {
        openModal({
          templateUrl: 'app/application/credit_report_pull_auth/credit_report_modal.html',
          controller: 'CreditReportAuthCtrl',
          size: 'lg'
        });
      },
      closeModal: function () {
        $rootScope.modal.dismiss('cancel');
      }
    };
  });