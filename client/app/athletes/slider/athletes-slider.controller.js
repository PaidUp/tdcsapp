'use strict';

angular.module('convenienceApp')
  .controller('AthletesSliderCtrl', function ($scope, $rootScope, UserService, FlashService, AuthService, $state, $stateParams) {
    $scope.athletes =[];
    $scope.user = angular.copy(AuthService.getCurrentUser());
    $scope.fullDetails = false;
    $rootScope.$emit('bar-welcome', {
      left:{
        url: 'app/athletes/templates/my-athletes-title.html'
      } ,
      right:{
        url: 'app/athletes/create/create-athlete.html'
      }
    });

    if ($stateParams.athleteId) {
      // UserService.listRelations().then(function (data) {
      //   angular.forEach(data, function (relation, index) {
      //     if (relation.type === 'child') {
      //       UserService.getUser(relation.targetUserId).then(function (athlete) {
      //         console.log('Child: ', athlete);
      //         $scope.athletes.push(athlete);
      //         if (data.length === 1) {
      //           $scope.selectAthlete(athlete, index);
      //           return;
      //         } else if ($stateParams.athleteId === athlete._id) {
      //           $scope.selectAthlete(athlete, index);
      //         }
      //       }).catch(function (err) {
      //         FlashService.addAlert({
      //           type: 'danger',
      //           msg: err.data.message,
      //           timeout: 10000
      //         });
      //       });
      //     }
      //   });
      // }).catch(function (err) {
      //   FlashService.addAlert({
      //     type: 'danger',
      //     msg: err.data.message,
      //     timeout: 10000
      //   });
      // });
      UserService.getUser($stateParams.athleteId).then(function (athlete) {
        $scope.athletes.push(athlete);
        $scope.selectAthlete(athlete);
        if ($scope.athlete.teams) {
          $scope.athlete.team = $scope.athlete.teams[0];
        }
      }).catch(function (err) {
        FlashService.addAlert({
          type: 'danger',
          msg: err.data.message,
          timeout: 10000
        });
      });
    } else {
      $state.go('athletes');
    }

    $scope.toggleDetails = function () {
      if ($scope.fullDetails) {
        $scope.fullDetails = false;
        UserService.getContact($scope.user._id, $scope.athletes.contacts[0].contactId).then(function (data) {
          $scope.contactInfo = data;
        });
      } else {
        $scope.fullDetails = true;
      }
    };

    $scope.updateAthlete = function (athlete) {
      var update = athlete || $scope.athlete;
      $state.go('update-athlete', {athleteId: update._id});
    };

    $scope.selectAthlete = function (athlete, index, updateUrl) {
      if ($scope.athletes.length > 1) {
        if ($scope.athletes[0]._id === athlete._id) {
          return;
        }
        var swap = angular.extend({}, $scope.athletes[0]);
        $scope.athletes[0] = $scope.athletes[index];
        $scope.athletes[index] = swap;
      }
      $scope.athlete = $scope.athletes[0];
      if (updateUrl) {
        $state.transitionTo($state.current, {athleteId: athlete._id}, { location: true, inherit: true, relative: $state.$current, notify: false });
      }
    };

    $scope.selectTeamForAthlete = function () {
      $state.go('teams-profile-athlete',{
        // teamId: $scope.athlete.team.product_id,
        teamId: $scope.team.attributes.productId,
        athleteId: $scope.athlete._id
      });
    };

    $scope.onSlideChanged = function (nextSlide, direction) {
      // if (direction) {
      // $scope.selectAthlete(nextSlide.$parent.childAthlete, nextSlide.$parent.index, true);
      // return;
      // }
      // $state.transitionTo($state.current, {athleteId: nextSlide.$parent.childAthlete._id}, { location: true, inherit: true, relative: $state.$current, notify: false });
    };
  });