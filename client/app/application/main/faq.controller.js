'use strict';

angular.module('convenienceApp')
  .controller('FaqCtrl', function ($scope) {

    $scope.faqGroup = {
      pricing : false,
      payment : false,
      selectfund : false
    };

    $scope.selectGroup = function(group){
      for (var key in $scope.faqGroup) {
        $scope.faqGroup[key] = false;
      }
      $scope.faqGroup[group] = true;
    };



  });
