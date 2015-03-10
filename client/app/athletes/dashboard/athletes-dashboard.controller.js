'use strict';

angular.module('convenienceApp')
  .controller('AthletesDashboardCtrl', function ($scope, $rootScope, UserService, FlashService, $state, ModalFactory) {
    $scope.modalFactory = ModalFactory;
    $scope.isChildCharged = false;
    $scope.athletes = [];
    $rootScope.$emit('bar-welcome', {
      left:{
        url: 'app/athletes/templates/my-athletes-title.html'
      } ,
      right:{
        url: 'app/athletes/create/create-athlete.html'
      }
    });

    UserService.listRelations().then(function (data) {
      if(data.length==0){
        $scope.isChildCharged = true;
        return;
      }
      // if (data.length === 1) {
      //   $state.go('athletes-slider',{athleteId: data[0].targetUserId});
      //   return;
      // }
      angular.forEach(data, function (relation) {
        if (relation.type === 'child') {
          UserService.getUser(relation.targetUserId).then(function (user) {
            if (user.teams) {
              user.team = user.teams[0];
            }
            $scope.athletes.push(user);
          }).catch(function (err) {
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