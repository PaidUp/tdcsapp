'use strict';

angular.module('convenienceApp')
  .controller('TeamsDashboardCtrl', function ($scope, UserService, $rootScope, $state, $localStorage) {

    $rootScope.$emit('bar-welcome', {
      left:{
        url: ''
      } ,
      right:{
        url: ''
      }
    });

    $scope.$storage = $localStorage.$default({});

    if($scope.$storage.pnTeam){
      $state.go('teams-profile',{
        teamId: $scope.$storage.pnTeam
      });
    }

    $scope.viewTeamProfile = function () {
      if ($scope.team) {
        $state.go('teams-profile',{
          teamId: $scope.team.entityId
        });
      };
    };
  });
  // 'use strict';

  // angular.module('convenienceApp')
  //   .controller('TeamsDashboardCtrl', function ($scope, UserService, $rootScope, $state, $stateParams, FlashService, AuthService) {

  //     $scope.viewTeamProfile = function () {
  //       $state.go('teams-profile',{
  //         teamId: $scope.team.product_id
  //       });
  //     };
  //   });
