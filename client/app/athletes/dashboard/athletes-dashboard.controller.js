'use strict';

angular.module('convenienceApp')
  .controller('AthletesDashboardCtrl', function ($log,$scope, $rootScope, UserService, AuthService, FlashService, $state,
                                                 ModalFactory, TrackerService, $localStorage) {
    TrackerService.pageTrack();

    $scope.modalFactory = ModalFactory;
    $scope.isChildCharged = false;
    $scope.athletes = [];
    $scope.$storage = $localStorage.$default({});

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
              //Important: check file athletes-slider.controller.js. and change the same logic.
              user[0].nameTeams = "";
              for(var i=0; i < user[0].teams.length; i++){
                if (user[0].teams && user[0].teams[i].seasonEnd && new Date(user[0].teams[i].seasonEnd) != 'Invalid Date'){
                  if(new Date(user[0].teams[i].seasonEnd) > new Date()){
                    user[0].nameTeams += user[0].teams[i].name + " and ";
                    user[0].team = user[0].teams[i];//This line is important in the athletes-dashboard.html, is necessary for validate if the athlete have teams and show your names.
                  }
                }
              }
              user[0].nameTeams = user[0].nameTeams.slice(0, -5);//remember this line remove the last "and" if you change this one word, please change the number 5 for the quantity the words you want delete.
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
      TrackerService.create('selectAthlete',{
        firsName : athlete.firstName,
        lastName : athlete.lastName
      });
      if($scope.$storage.pnTeam){
        $state.go('teams-profile-athlete', {teamId : $scope.$storage.pnTeam, athleteId: athlete._id});
      }else{
        $state.go('athletes-slider', {athleteId: athlete._id});
      }

    };

    $scope.updateAthlete = function (athlete) {
      TrackerService.create('updateAthlete');
      var update = athlete || $scope.athlete;
      $state.go('update-athlete', {athleteId: update._id});
    };

    $scope.selectAthleteEdit = function(athlete){
      $rootScope.athleteEdit = athlete;
    }

    // $scope.$watch('athlete.team', function () {
    //   if ($scope.athlete) {
    //     console.log('Team Selected: ', $scope.athlete.team);
    //     console.log('For Child: ', $scope.athlete);
    //   }
    // });
  });
