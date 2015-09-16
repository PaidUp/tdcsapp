'use strict';

angular.module('convenienceApp')
  .controller('UpdateAthleteModalCtrl', function ($scope, UserService, $rootScope, $state, $stateParams, FlashService,
                                                  AuthService, ModalFactory) {
    var currentDate = moment();
    var minDate = moment().subtract(60, 'year');

    $scope.modalFactory = ModalFactory;

    $scope.init = function(){
      if($rootScope.athleteEdit){
        $scope.athleteEdit = $rootScope.athleteEdit;
        var birthDate = new Date($scope.athleteEdit.birthDate.substr(0,10).replace(/-/gi,"/"));


        $scope.date = {
          year : birthDate.getFullYear(),
          month : 1+birthDate.getMonth(),
          day : birthDate.getDate()
        };

        delete $rootScope.athleteSelected;
      }else{
        $scope.athleteEdit = {};
      }
      console.log('$rootScope.athleteEdit',$rootScope.athleteEdit);
    };

    $scope.isValidDate = function () {
      // moment.js takes the month as an array position so:
      // Jan is the month 0, Feb is the month 1 and so on
      // but the user enters it normally
      var tmpDate = angular.extend({}, $scope.date);
      tmpDate.month -= 1;
      tmpDate.day -= 1;
      var birthdate = moment(tmpDate);
      var dateRange = moment().range(minDate, currentDate);
      if (birthdate.isValid() && dateRange.contains(birthdate)) {
        $scope.addAthleteForm.$setValidity('date', true);
        $scope.athleteEdit.birthDate = $scope.date.year + '-' + $scope.date.month + '-' + $scope.date.day;
        return true;
      } else {
        $scope.addAthleteForm.$setValidity('date', false);
        return false;
      }
    };

    $scope.updateAthlete = function () {
      $scope.submitted = true;
      $scope.isValidDate();
      if ($scope.addAthleteForm.$dirty && $scope.addAthleteForm.$valid) {
        $scope.updateUser();
      }
    };

    $scope.updateUser = function () {
      var currentUserId = AuthService.getCurrentUser()._id;
     // $scope.user.userId = $scope.user._id;
      UserService.updateUser({
        userId: $scope.athleteEdit._id,
        parentId: currentUserId,
        firstName: $scope.athleteEdit.firstName,
        lastName: $scope.athleteEdit.lastName,
        gender: $scope.athleteEdit.gender,
        birthDate: $scope.athleteEdit.birthDate
      }).then(function () {
        $scope.modalFactory.closeModal();
        FlashService.addAlert({
          type: 'success',
          templateUrl: 'components/application/directives/alert/alerts/update-profile-success.html',
          timeout: 5000
        });
      }).catch(function (err) {
        FlashService.addAlert({
          type: 'danger',
          msg: err.data.message,
          timeout: 10000
        });
      });
    };

  });
