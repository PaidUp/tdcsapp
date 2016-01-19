'use strict';

angular.module('convenienceApp')
  .controller('FaqCtrl', function ($scope, $stateParams, $state, $cookieStore, ModalFactory, Idle, ContactService) {

    $scope.faqGroup = {};
    $scope.modalFactory = ModalFactory;

    $scope.selectGroup = function(group){
      $state.go('faq-g',{
        group: group
      });
    };

    var startIdle = false;

    $scope.$on('IdleStart', function() {

      if(!startIdle){

        if(!$cookieStore.get(ContactService.ctaModalFlag)){
          ModalFactory.CtaModal('cta-faq');
        }
      }
      startIdle = true;
    });
    
    $scope.init = function(){
      Idle.watch();
      if($stateParams.group){
        $scope.faqGroup[$stateParams.group] = true;
      }
    }

  });
