'use strict';

angular.module('convenienceApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('athletes', {
        url: '/athletes/dashboard',
        templateUrl: 'app/athletes/dashboard/athletes-dashboard.html',
        controller: 'AthletesDashboardCtrl',
        auth: true
      }).state('update-athlete', {
        url: '/athletes/update/:athleteId',
        templateUrl: 'app/athletes/update/update-athlete.html',
        controller: 'UpdateAthleteCtrl',
        auth: true
      }).state('athletes-slider', {
        url: '/athletes/slider/:athleteId',
        templateUrl: 'app/athletes/slider/athletes-slider.html',
        controller: 'AthletesSliderCtrl',
        auth: true
      });
  });
