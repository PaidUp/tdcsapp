'use strict';

angular.module('convenienceApp')
  .controller('CtaFaqController', ['$scope','ContactService', 'ModalFactory', 'FlashService',
    function($scope, ContactService, ModalFactory, FlashService) {
      $scope.modalFactory = ModalFactory;

      if($scope.subject){
        console.log('subject' , $scope.subject);
        $scope.contactInfo = {subject : $scope.subject};
      }

    $scope.contactUs = function (form, contactInfo) {
      $scope.submitted = true;
      if (form.$valid) {

        contactInfo.subject = 'CTA FAQ'

        contactInfo.content = 'Name: '+contactInfo.name+ ' | Phone: '+contactInfo.phone;

        ContactService.contactUs(contactInfo);
        $scope.contactInfo = {};
        $scope.submitted = false;

        FlashService.addAlert({
          type: 'success',
          msg: 'Thanks.  Allan will contact you shortly.',
          timeout: 10000
        });


      }
    };
}]).directive('ctaFaq', function () {
    return {
      templateUrl: 'components/application/directives/cta-faq/cta-faq.html',
      restrict: 'E',
      controller: 'CtaBoxController',
      scope: {
        subject: "@subject"
      }
    };
  });
