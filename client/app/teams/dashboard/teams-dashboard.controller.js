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
        if($scope.team.attributes.type === 'grouped'){
          $state.go('teams-dashboard-group',{
            teamId: $scope.team.attributes.productId
          });
        }else{
          $state.go('teams-profile',{
            teamId: $scope.team.attributes.productId
          });
        }

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
