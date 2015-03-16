'use strict';

angular.module('convenienceApp').
  directive('listTeams', function () {
    return {
      restrict: 'E',
      templateUrl: 'components/teams/directives/list-teams/list-teams.html',
      controller: 'TeamsCtrl',
      scope: {
        team: '='
      }
    };
  });