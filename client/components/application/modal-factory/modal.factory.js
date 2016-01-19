'use strict';

angular.module('convenienceApp')
  .factory('ModalFactory', function ($rootScope, $modal) {

    var openModal = function (options) {
      $rootScope.modal = $modal.open(options);
    };
    return {
      PrivacyModal: function () {
        openModal({
          templateUrl: 'app/application/privacy-policy/privacy-modal.html',
          controller: 'PrivacyCtrl',
          size: 'lg'
        });
      },
      PrivacyAgreementModal: function () {
        openModal({
          templateUrl: 'app/application/privacy-policy/privacy-modal-agreement.html',
          controller: 'PrivacyCtrl',
          size: 'lg',
          backdrop: 'static',
          keyboard: false
        });
      },
      BoomModal: function () {
        openModal({
          templateUrl: 'app/application/boom-agreement/boom-modal.html',
          controller: 'BoomCtrl',
          size: 'lg'
        });
      },
      ElectronicModal: function () {
        openModal({
          templateUrl: 'app/application/electronic-communications-agreement/electronic-agreementmodal.html',
          controller: 'ElectronicCtrl',
          size: 'lg'
        });
      },
      ContactUsModalConfirmation: function () {
        openModal({
          templateUrl: 'app/application/main/confirmation-contact-us-modal.html',
          controller: 'ContactUsCtrl',
          size: 'sm'
        });
      },
      ContactUsModal: function () {
        openModal({
          templateUrl: 'app/application/main/contact-us-modal.html',
          controller: 'ContactUsCtrl',
          size: 'sm'
        });
      },
      PhoneAuthModal: function () {
        openModal({
          templateUrl: 'app/application/phone-authorization/phone-modal.html',
          controller: 'PhoneAuthCtrl',
          size: 'lg'
        });
      },
      TermsOfServiceModal: function () {
        openModal({
          templateUrl: 'app/application/terms-of-service/terms-modal.html',
          controller: 'TermsOfServiceCtrl',
          size: 'lg'
        });
      },
      ReferralProgramModal: function () {
        openModal({
          templateUrl: 'app/application/main/referral-program/referral-program-rules.html',
          controller : 'ReferralProgramCtrl',
          size: 'lg',
          resolve : {
            ModalParams : function () {
              return {
                isModal : true
              };
            }
          }
        });
      },
      CreateAthleteModal: function () {
        openModal({
          templateUrl: 'app/athletes/create/create-athlete-modal.html',
          controller: 'CreateAthleteCtrl',
          size: 'sm'
        });
      },
      UpdateAthleteModal: function () {
        openModal({
          templateUrl: 'app/athletes/update/update-athlete-modal.html',
          controller: 'UpdateAthleteModalCtrl',
          size: 'sm'
        });
      },
      CreditReportAuthModal: function () {
        openModal({
          templateUrl: 'app/application/credit-report-pull-auth/credit-report-modal.html',
          controller: 'CreditReportAuthCtrl',
          size: 'lg'
        });
      },
      ContactUs: function (subject) {
        openModal({
          templateUrl: 'app/application/contact-form/contact-us.html',
          size: 'md'
        });
      },
      CtaBox: function (subject) {
        openModal({
          templateUrl: 'app/application/contact-form/cta-box.html',
          size: 'md'
        });
      },
      CtaFaq: function () {
        openModal({
          templateUrl: 'app/application/contact-form/cta-faq.html',
          size: 'lg'
        });
      },
      closeModal: function () {
        $rootScope.modal.dismiss('cancel');
      }
    };
  });

angular.module('convenienceApp')
  .factory('ModalParams', function () {
    return {};
  });
