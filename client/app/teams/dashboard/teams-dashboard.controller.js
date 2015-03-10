'use strict';

angular.module('convenienceApp')
  .controller('TeamsDashboardCtrl', function ($scope, UserService, $rootScope, $state, $stateParams, FlashService, AuthService) {

    $rootScope.$emit('bar-welcome', {
      left:{
        url: ''
      } ,
      right:{
        url: ''
      }
    });

    $scope.viewTeamProfile = function () {
      if ($scope.team) {
        $state.go('teams-profile',{
          teamId: $scope.team.attributes.productId
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