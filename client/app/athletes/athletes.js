'use strict';

angular.module('convenienceApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('athletes', {
        url: '/athletes/dashboard',
        templateUrl: 'app/athletes/dashboard/athletes-dashboard.html',
        controller: 'AthletesDashboardCtrl',
        auth: true,
        data:{
          roles:['user','guest']
        }
      }).state('update-athlete', {
        url: '/athletes/update/:athleteId',
        templateUrl: 'app/athletes/update/update-athlete.html',
        controller: 'UpdateAthleteCtrl',
        auth: true,
        data:{
          roles:['user','guest']
        }
      }).state('athletes-slider', {
        url: '/athletes/slider/:athleteId',
        templateUrl: 'app/athletes/slider/athletes-slider.html',
        controller: 'AthletesSliderCtrl',
        auth: true,
        data:{
          roles:['user','guest']
        }
      }).state('athletes-slider-group', {
        url: '/athletes/slider/:athleteId/team/:teamId',
        templateUrl: 'app/athletes/slider/athletes-slider.html',
        controller: 'AthletesSliderCtrl',
        auth: true,
        data:{
          roles:['user','guest']
        }
      });
  });
