'use strict';

angular.module('convenienceApp')
  .controller('TeamsProfileCtrl', function ($rootScope, $scope, UserService, AuthService, FlashService, ContactService, $state, $stateParams, TeamService, CartService) {

    $rootScope.$emit('bar-welcome', {
      left:{
        url: ''
      } ,
      right:{
        url: ''
      }
    });
    // $scope.athletes = [{
    //   _id: 'addAthlete',
    //   firstName: 'Add New Athlete'
    // }];
    $scope.athletes = [];
    // $scope.athlete = {};

    TeamService.getTeam($stateParams.teamId).then(function (team) {
      $scope.team = team;
      $scope.selectedCustomOptions = {
        productId: $scope.team.attributes.productId,
        sku: $scope.team.attributes.sku,
        qty: 1,
        options: {}
      };
    });

    $scope.underAges = TeamService.getTeamUnderAges($stateParams.teamId);
    $scope.underAge = $scope.underAges[0];

    $scope.sendAlertErrorMsg = function (msg) {
      FlashService.addAlert({
        type: 'danger',
        msg: msg,
        timeout: 10000
      });
    };

    AuthService.isLoggedInAsync(function(loggedIn) {
      $scope.user = angular.extend({}, AuthService.getCurrentUser());
      UserService.listRelations($scope.user._id).then(function (data) {
        angular.forEach(data, function (relation) {
          if (relation.type === 'child') {
            UserService.getUser(relation.targetUserId).then(function (athlete) {
              console.log('athlete', athlete);
              $scope.athletes.push(athlete[0]);
              if (data.length === 1) {
                $scope.athlete = athlete[0];
                return;
              } else if ($stateParams.athleteId === athlete[0]._id) {
                $scope.athlete = athlete[0];
              }
            }).catch(function (err) {
              $scope.sendAlertErrorMsg(err.data.message);
            });
          }
        });
      }).catch(function (err) {
        $scope.sendAlertErrorMsg(err.data.message);
      });
    });
    
    $scope.enrollNow = function () {
      $scope.submitted = true;
      $scope.enrolled = true;
      if ($scope.teamSelectionForm.$valid) {
        CartService.createCart().then(function () {
          CartService.addProductToCart([$scope.selectedCustomOptions], $scope.athlete._id).then(function () {
            $state.go('cart');
          }).catch(function (err) {
            $scope.enrolled = false;
            $scope.sendAlertErrorMsg(err.data.message);
          });
        }).catch(function (err) {
          $scope.enrolled = false;
          $scope.sendAlertErrorMsg(err.data.message);
        });
      }
    };

    $scope.changeCustomOptions = function (customOption, optionModel) {
      if (optionModel && optionModel.valueId) {
        $scope.selectedCustomOptions.options[customOption.optionId] = optionModel.valueId;
      }
    };

    // $scope.selectAthlete = function (athlete) {
    //   if (athlete.firstName === 'Add New Athlete') {
    //     console.log('Add New Athlete');
    //   }
    // };
  });