'use strict';

angular.module('convenienceApp')
  .controller('AthletesSliderCtrl', function ($scope, $rootScope, TeamService, UserService, CommerceService, FlashService,
                                              AuthService, $state, $stateParams, TrackerService) {
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
    $scope.sendAlertErrorMsg = function (msg) {
      FlashService.addAlert({
        type: 'danger',
        msg: msg,
        timeout: 10000
      });
    };

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
        $scope.athletes.push(athlete[0]);
        $scope.selectAthlete(athlete[0]);
        if ($scope.athlete.teams) {
          //Important: check file athletes-dashboard.controller.js. and change the same logic.
          $scope.athlete.nameTeams = "";
          for(var i=0; i < $scope.athlete.teams.length; i++){
            if ($scope.athlete.teams && $scope.athlete.teams[i].seasonEnd && new Date($scope.athlete.teams[i].seasonEnd) != 'Invalid Date'){
              if(new Date($scope.athlete.teams[i].seasonEnd) > new Date()){
                $scope.athlete.nameTeams += $scope.athlete.teams[i].name + " and ";
                $scope.athlete.team = $scope.athlete.teams[i];//This line is important in the athletes-dashboard.html, is necessary for validate if the athlete have teams and show your names.
              }
            }
          }
          $scope.athlete.nameTeams = $scope.athlete.nameTeams.slice(0, -5);//remember this line remove the last "and" if you change this one word, please change the number 5 for the quantity the words you want delete.
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
      TrackerService.create('selectTeamForAthlete');
      $state.go('teams-profile-athlete',{
        // teamId: $scope.athlete.team.product_id,
        teamId: $scope.team.entityId,
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

    $scope.loading = true;
    $scope.orders = [];
    CommerceService.getOrders().then(function (orders) {
      if (orders === 0) {
        $scope.loading = false;
      }else{
        angular.forEach(orders, function (order) {
          if($stateParams.athleteId == order.athleteId){
            $scope.orders.push(order);
            TeamService.getTeam(order.products[0].productId).then(function (team) {
              order.isOpen = false;
              order.team = team;
                order.nextPaymentDate = getNextPaymentDate(order.schedulePeriods);
            });
          }
        });
      }
    }).catch(function (err) {
      $scope.loading = false;
      //$scope.sendAlertErrorMsg(err.data.message);
    }).finally(function(){
      $scope.loading = false;
    });

    $scope.prettify = function (date) {
      return moment(date).format('MMMM DD, YYYY');
    };

    function getNextPaymentDate (scheduleArray) {
      var date;
      var paymentNumber;
      var schedule;
      var hasPending;
      var isDelinquent = false;
      if(scheduleArray){
        for (var i=0; i < scheduleArray.length; i++) {
          schedule = scheduleArray[i];
          if (schedule.state === 'failed') {
            isDelinquent = true;
            break;
          }
          if (schedule.state === 'pending') {
            hasPending = true;
            date = $scope.prettify(schedule.paymentDay);
            paymentNumber = $scope.getGetOrdinal(i + 1);
            break;
          }
        }
      }

      if (hasPending) {
        return paymentNumber + ' payment ' + date;
      } else if (isDelinquent) {
        return 'None - Loan Delinquent';
      }else {
        return 'None - Loan Complete';
      }
    };
  });
