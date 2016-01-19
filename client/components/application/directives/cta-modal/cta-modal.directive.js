'use strict';

angular.module('convenienceApp')
  .controller('CtaModalController', ['$scope','ContactService', 'ModalFactory', 'FlashService', '$cookieStore',
    function($scope, ContactService, ModalFactory, FlashService, $cookieStore) {

      $scope.modalFactory = ModalFactory;

      if($scope.subject){
        $scope.contactInfo = {subject : $scope.subject};
      }else{
        $scope.contactInfo = {subject : 'CTA without subject'};
      }

    $scope.contactUs = function (form, contactInfo) {
      $scope.submitted = true;
      if (form.$valid) {

        contactInfo.content = 'Name: '+contactInfo.name+ ' | Phone: '+contactInfo.phone;

        ContactService.contactUs(contactInfo);
        $scope.contactInfo = {};
        $scope.submitted = false;

        $cookieStore.put(ContactService.ctaModalFlag , true);

        FlashService.addAlert({
          type: 'success',
          msg: 'Thanks.  Allan will contact you shortly.',
          timeout: 10000
        });


      }
    };
}]).directive('ctaModal', function () {
    return {
      templateUrl: 'components/application/directives/cta-modal/cta-modal.html',
      restrict: 'E',
      controller: 'CtaModalController',
      scope: {
        subject: "@subject"
      }
    };
  });
