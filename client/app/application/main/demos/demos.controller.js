/**
 * Created by riclara on 12/18/15.
 */

'use strict';

angular.module('convenienceApp')
  .controller('DemosCtrl', function ($scope, $stateParams, $state, TrackerService, $cookieStore, ModalFactory, Idle, ContactService) {
    TrackerService.pageTrack();
    $scope.videos = {};

    var startIdle = false;

    /*
    $scope.$on('IdleStart', function() {
      if(!startIdle){
        if(!$cookieStore.get(ContactService.ctaModalFlag)){
          ModalFactory.CtaModal('cta-demos' , 'lg');
        }
      }
      startIdle = true;
    });
    */

    $scope.selectVideo = function(name){
      $state.go('demos-g',{
        name: name
      });
    };

    $scope.init = function(){
      //Idle.watch();
      if(!startIdle){
        if(!$cookieStore.get(ContactService.ctaModalFlag)){
          ModalFactory.CtaModal('cta-demos' , 'lg');
        }
      }
      startIdle = true;

      if($stateParams.name){
        $scope.videos[$stateParams.name] = true;
      } else {
        $scope.videos.live = true;
      }
    }
  });
