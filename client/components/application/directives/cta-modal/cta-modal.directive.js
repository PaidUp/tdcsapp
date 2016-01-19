'use strict';

angular.module('convenienceApp')
  .controller('CtaModalController', ['$scope','ContactService', 'ModalFactory', 'FlashService', '$cookieStore',
    function($scope, ContactService, ModalFactory, FlashService, $cookieStore) {

      $scope.content = {
        faq : {
          header : 'Still have questions?',
          body : 'Interested in learning more, but want to speak with someone? We’ll have someone from our team ' +
          'contact you today.',
          button : 'More Details Please',
          subject : 'CTA - FAQ'
        },
        demos : {
          header : 'Thank you for your interest in our services',
          body : 'Would you like to speak with someone? We can contact you today.',
          button : 'Contact Me',
          subject : 'CTA - DEMOS'
        }
      }

      $scope.modalFactory = ModalFactory;

      if($scope.page){
        $scope.contactInfo = {subject : $scope.content[$scope.page].subject};
      }else{
        $scope.contactInfo = {subject : 'CTA without subject'};
      }

    $scope.contactUs = function (form, contactInfo) {
      $scope.submitted = true;
      if (form.$valid) {

        var name = contactInfo.name || ' ';
        var phone = contactInfo.phone || ' ';


        contactInfo.content = 'Name: '+name+ ' | Phone: '+phone;

        ContactService.contactUs(contactInfo);
        $scope.contactInfo = {};
        $scope.submitted = false;

        $cookieStore.put(ContactService.ctaModalFlag , true);

        FlashService.addAlert({
          type: 'success',
          msg: 'Thanks.  Allan will contact you shortly.',
          timeout: 10000
        });

        ModalFactory.closeModal();
      }
    };
}]).directive('ctaModal', function () {
    return {
      templateUrl: 'components/application/directives/cta-modal/cta-modal.html',
      restrict: 'E',
      controller: 'CtaModalController',
      scope: {
        page: "@page"
      }
    };
  });
