'use strict';

angular.module('convenienceApp').
  directive('listTeams', function () {
    return {
      restrict: 'E',
      templateUrl: 'components/teams/list_teams_directive/list_teams.html',
      controller: 'TeamsCtrl',
      scope: {
        team: '='
      }
    };
  });