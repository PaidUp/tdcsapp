'use strict';

angular.module('convenienceApp')
  .controller('AthletesDashboardCtrl', function ($log,$scope, $rootScope, UserService, AuthService, FlashService, $state, ModalFactory) {

    $scope.modalFactory = ModalFactory;
    $scope.isChildCharged = false;
    $scope.athletes = [];

    $rootScope.$emit('init-cart-service' , {});

    $rootScope.$emit('bar-welcome', {
      left:{
        url: 'app/athletes/templates/my-athletes-title.html'
      } ,
      right:{
        url: 'app/athletes/create/create-athlete.html'
      }
    });

    AuthService.isLoggedInAsync(function(loggedIn) {
      $scope.user = angular.extend({}, AuthService.getCurrentUser());
      UserService.listRelations($scope.user._id).then(function (data) {
        console.log('data',data);
        if(data.length==0){
          $scope.isChildCharged = true;
          return;
        }//else{
          //$state.go('user-enrollments');
        //}
        // if (data.length === 1) {
        //   $state.go('athletes-slider',{athleteId: data[0].targetUserId});
        //   return;
        // }
        angular.forEach(data, function (relation) {
          if (relation.type === 'child') {
            UserService.getUser(relation.targetUserId).then(function (user) {
              //HERE
              console.log('user',user);
              if (user[0].teams){
                console.log('user[0].teams',user[0].teams);
                user[0].team = user[0].teams[0];
              }
              $scope.athletes.push(user[0]);
            }). catch(function (err) {
              FlashService.addAlert({
                type: 'danger',
                msg: err.data.message,
                timeout: 10000
              });
            });
          }
        });
      }).catch(function (err) {
        FlashService.addAlert({
          type: 'danger',
          msg: err.data.message,
          timeout: 10000
        });
      });
    });

    $scope.selectAthlete = function (athlete) {
      $state.go('athletes-slider', {athleteId: athlete._id});
    };

    $scope.updateAthlete = function (athlete) {
      var update = athlete || $scope.athlete;
      $state.go('update-athlete', {athleteId: update._id});
    };

    // $scope.$watch('athlete.team', function () {
    //   if ($scope.athlete) {
    //     console.log('Team Selected: ', $scope.athlete.team);
    //     console.log('For Child: ', $scope.athlete);
    //   }
    // });
  });
