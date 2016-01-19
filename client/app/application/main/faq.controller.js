'use strict';

angular.module('convenienceApp')
  .controller('FaqCtrl', function ($scope, $stateParams, $state, $cookieStore, ModalFactory) {

    $scope.faqGroup = {};
    $scope.modalFactory = ModalFactory;

    $scope.selectGroup = function(group){
      $state.go('faq-g',{
        group: group
      });
    };

    function showModal(){
      ModalFactory.CtaFaq();
    }

    $scope.init = function(){
      if($stateParams.group){
        $scope.faqGroup[$stateParams.group] = true;
      }
    }


    showModal();

  });
