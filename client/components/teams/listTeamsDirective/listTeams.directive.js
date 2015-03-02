'use strict';

angular.module('convenienceApp').
  directive('listTeams', function () {
    return {
      restrict: 'E',
      templateUrl: 'components/teams/listTeamsDirective/listTeams.html',
      controller: 'TeamsCtrl',
      scope: {
        team: '='
      }
    };
  });