'use strict';

angular.module('convenienceApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('teams-dashboard', {
        url: '/teams/dashboard/',
        templateUrl: 'app/teams/dashboard/teams-dashboard.html',
        controller: 'TeamsDashboardCtrl',
        auth: true,
        data:{
          roles:['user']
        }
      }).state('teams-profile-athlete', {
        url: '/teams/profile/:teamId/athlete/:athleteId',
        templateUrl: 'app/teams/profile/team-profile.html',
        controller: 'TeamsProfileCtrl',
        auth: true,
        data:{
          roles:['user']
        }
      }).state('teams-profile', {
        url: '/teams/profile/:teamId',
        templateUrl: 'app/teams/profile/team-profile.html',
        controller: 'TeamsProfileCtrl',
        auth: true,
        data:{
          roles:['user']
        }
      });
  });
