'use strict';

angular.module('convenienceApp')
  .controller('FaqCtrl', function ($scope, $stateParams, $state) {

    $scope.faqGroup = {};

    $scope.selectGroup = function(group){
      $state.go('faq-g',{
        group: group
      });
    };

    $scope.init = function(){
      if($stateParams.group){
        $scope.faqGroup[$stateParams.group] = true;
      }
    }
  });
