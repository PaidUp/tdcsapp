'use strict';

angular.module('convenienceApp')
  .controller('AthletesDashboardCtrl', function ($scope, $rootScope, UserService, AuthService, FlashService, $state, ModalFactory) {
    
    
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

    AuthService.isLoggedInAsync(function(loggedIn) {
      $scope.user = angular.extend({}, AuthService.getCurrentUser()); 

      console.log('Estoy en isLoggedInAsync', $scope.user);

      UserService.listRelations($scope.user._id).then(function (data) {
        if(data.length==0){
          $scope.isChildCharged = true;
          return;
        }
        // if (data.length === 1) {
        //   $state.go('athletes-slider',{athleteId: data[0].targetUserId});
        //   return;
        // }
        UserService.getUser($scope.user._id).then(function (users) {
          angular.forEach(users, function (user) {
            angular.forEach(data, function (relation) {
              if (relation.type === 'child' && relation.targetUserId === user._id) {
                if (user.teams){
                  user.team = user.teams[0];
                }
                $scope.athletes.push(user);
              }
            });
          });
        }). catch(function (err) {
          FlashService.addAlert({
            type: 'danger',
            msg: err.data.message,
            timeout: 10000
          });
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