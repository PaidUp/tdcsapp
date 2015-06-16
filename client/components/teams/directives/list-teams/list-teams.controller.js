'use strict';

angular.module('convenienceApp')
  .controller('TeamsCtrl', function ($scope, TeamService, $stateParams) {

    $scope.teams = [];

    if($stateParams.teamId){
      TeamService.getTeamsGrouped($stateParams.teamId).then(function (teams) {
        $scope.teams = teams;
      }).catch(function (err) {

      });
    }else{
      TeamService.getTeams().then(function (teams) {
        $scope.teams = teams;
      }).catch(function (err) {

      });
    }


    $scope.selectTeam = function (team) {
      $scope.team = team;
    };
  });

  // 'use strict';

  // angular.module('convenienceApp')
  //   .controller('TeamsCtrl', function ($scope, TeamService) {

  //     $scope.teams = [];
  //     TeamService.getTeams().then(function (data) {
  //       angular.forEach(data, function (teamInfo) {
  //         TeamService.getTeam(teamInfo.product_id).then(function (team) {
  //           console.log('TEAM: ', team);
  //           $scope.teams.push(team);
  //         }).catch(function (err) {

  //         });
  //       });
  //     }).catch(function (err) {

  //     });;

  //     $scope.selectTeam = function (team) {
  //       $scope.team = team;
  //     };
  //   });
