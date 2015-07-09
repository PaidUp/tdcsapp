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





    function loadTeam(teamID){
      TeamService.getTeam(teamID).then(function (team) {

        if(team.attributes.type === 'grouped'){
          TeamService.getTeamsGrouped(teamID).then(function (teams) {
            $scope.teams = teams;
          }).catch(function (err) {

          });
        }

        $scope.team = team;
        $scope.price = Number($scope.team.attributes.price);
        $scope.selectedCustomOptions = {
          productId: $scope.team.attributes.productId,
          sku: $scope.team.attributes.sku,
          qty: 1,
          options: {}
        };

        $scope.team.attributes.customOptions[0].forEach(function(element, index, array){
          if(element.isRequire === '1' && element.values.length === 1){
            $scope.changeCustomOptions(element , element.values[0]);
          }
        });

      });
    };


    loadTeam($stateParams.teamId);


    $scope.underAges = TeamService.getTeamUnderAges($stateParams.teamId);
    $scope.underAge = $scope.underAges[0];

    $scope.sendAlertErrorMsg = function (msg) {
      FlashService.addAlert({
        type: 'danger',
        msg: msg,
        timeout: 10000
      });
    };

    AuthService.isLoggedInAsync(function (loggedIn) {
      $scope.user = angular.extend({}, AuthService.getCurrentUser());
      UserService.listRelations($scope.user._id).then(function (data) {
        angular.forEach(data, function (relation) {
          if (relation.type === 'child') {
            UserService.getUser(relation.targetUserId).then(function (athlete) {
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

    $scope.renderSubmit = true;

    $scope.enrollNow = function () {
      $scope.submitted = true;
      $scope.enrolled = true;
      if ($scope.teamSelectionForm.$valid) {
        $scope.renderSubmit = false;
        CartService.createCart().then(function () {
          CartService.addProductToCart([$scope.selectedCustomOptions], $scope.athlete).then(function () {
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
        customOption.isSelected=true;
      }
      $scope.price = CartService.calculatePrice($scope.team.attributes.price,
        $scope.selectedCustomOptions.options,
        $scope.team.attributes.customOptions[0]);
    };

    $scope.updateTeam = function(teamSelected){
      $scope.price = Number(teamSelected.attributes.price);
      $scope.selectedCustomOptions = {
        productId: teamSelected.attributes.productId,
        sku: teamSelected.attributes.sku,
        qty: 1,
        options: {}
      };

    };

    // $scope.selectAthlete = function (athlete) {
    //   if (athlete.firstName === 'Add New Athlete') {
    //     console.log('Add New Athlete');
    //   }
    // };
  });
