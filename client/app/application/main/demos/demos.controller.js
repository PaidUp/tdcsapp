/**
 * Created by riclara on 12/18/15.
 */

'use strict';

angular.module('convenienceApp')
  .controller('DemosCtrl', function ($scope, $stateParams, $state) {

    $scope.videos = {};


    $scope.selectVideo = function(name){
      $state.go('demos-g',{
        name: name
      });
    };

    $scope.init = function(){
      if($stateParams.name){
        $scope.videos[$stateParams.name] = true;
      } else {
        $scope.videos.live = true;
      }
    }
  });
