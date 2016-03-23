'use strict';

angular.module('convenienceApp')
  .controller('TeamsProfileCtrl', function ($rootScope, $scope, UserService, AuthService, FlashService,
                                            ContactService, $state, $stateParams, TeamService, CartService,
                                            TrackerService) {

    $rootScope.$emit('bar-welcome', {
      left:{
        url: ''
      } ,
      right:{
        url: ''
      }
    });

    $rootScope.$emit('init-cart-service' , {});
    // $scope.athletes = [{
    //   _id: 'addAthlete',
    //   firstName: 'Add New Athlete'
    // }];
    $scope.athletes = [];
    // $scope.athlete = {};

    $scope.renderTeams = false;
    $scope.showDropDownTeams = false;
    $scope.disablePayNow = false;
    $scope.showDropDownPaymenPlans = false;

    function loadTeams(team){
      $scope.showDropDownTeams = false;
      if(team.attributes.type === 'grouped'){
        $scope.renderTeams = true;
        TeamService.getTeamsGrouped(team.attributes.productId).then(function (teams) {
          $scope.teams = teams;
          $scope.showDropDownTeams = true;
        }).catch(function (err) {

        });
      }
    };

    function loadTeam(teamID, cb){
      TeamService.getTeam(teamID).then(function (team) {
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
        cb(team);
      });
    };


    loadTeam($stateParams.teamId, function(team){
      loadTeams(team)
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
      TrackerService.trackFormErrors('enrollNow', $scope.teamSelectionForm);
      $scope.submitted = true;
      $scope.enrolled = true;
      CartService.setCartDetails($scope.team, $scope.selectedCustomOptions, function(){
        if ($scope.teamSelectionForm.$valid) {
          $scope.disablePayNow = true;
          CartService.createCart().then(function () {
            CartService.addProductToCart([$scope.selectedCustomOptions], $scope.athlete).then(function () {
              $state.go('cart');
              TrackerService.create('pay now success');
            }).catch(function (err) {
              $scope.enrolled = false;
              $scope.sendAlertErrorMsg(err.data.message);
              TrackerService.create('pay now error' , {
                errorMessage : err.data.message
              });
            });
          }).catch(function (err) {
            $scope.enrolled = false;
            $scope.disablePayNow = false;
            $scope.sendAlertErrorMsg(err.data.message);
            TrackerService.create('pay now error' , {
              errorMessage : err.data.message
            });
          });
        }
      });
    };

    $scope.changeCustomOptions = function (customOption, optionModel) {
      TrackerService.create('changeCustomOptions', {
        optionSelected : customOption.title +' '+optionModel.title
      });
      if (optionModel && optionModel.valueId) {
        $scope.selectedCustomOptions.options[customOption.optionId] = optionModel.valueId;
        customOption.isSelected=true;
      }
      $scope.price = CartService.calculatePrice($scope.team.attributes.price,
        $scope.selectedCustomOptions.options,
        $scope.team.attributes.customOptions[0]);
    };


    $scope.updateTeam = function(teamSelected){
      TrackerService.create('Team Selected', {team : teamSelected.sku});
      $scope.disablePayNow = true;
      loadTeam(teamSelected.entityId, function(team){

        CartService.setOrderReques({productId : teamSelected.entityId});

        try{
          var fm = JSON.parse(team.attributes.feeManagement);
          var pm = JSON.parse(team.attributes.feeManagement).paymentPlans
          CartService.setFeeManagement(fm);
          $scope.paymentPlans = [];
          for(var reference in pm){
            $scope.paymentPlans.push({
              id : reference,
              description : pm[reference].description
            });
          }
          $scope.renderPaymentPlans = true;
          $scope.showDropDownPaymenPlans = true;
          $scope.disablePayNow = false;
        }catch (err){
          $scope.errorFeeManagment = true;
        }


      });
    };

    $scope.selectPaymentplan = function(pm){
      var ro = CartService.getOrderRequest();
      ro.paymentPlanSelected = pm.id;
      CartService.setOrderReques(ro);

      var fm = CartService.getFeeManagement();
      fm.paymentPlanSelected = pm.id;
      CartService.setFeeManagement(fm);
      $scope.disablePayNow = false;
    }


  });
