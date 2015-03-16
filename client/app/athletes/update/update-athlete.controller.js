'use strict';

angular.module('convenienceApp')
  .controller('UpdateAthleteCtrl', function ($scope, UserService, $rootScope, $state, $stateParams, FlashService, AuthService) {

    var currentDate = moment();
    var minDate = moment().subtract(60, 'year');
    $scope.oldPhone = {};

    if ($stateParams.athleteId) {
      UserService.getUser($stateParams.athleteId).then(function (user) {
        $scope.user = user;
        var date = moment(user.birthDate);
        $scope.date = {
          year: date.year(),
          month: date.month() + 1,
          day: date.date() + 1
        };
      }).catch(function (err) {
        FlashService.addAlert({
          type: 'danger',
          msg: err.data.message,
          timeout: 10000
        });
      });

      UserService.getContactList($stateParams.athleteId).then(function (data) {
        angular.forEach(data, function (contactInfo) {
          UserService.getContact(contactInfo.contactId).then(function (contact) {
            if (contact.type === 'telephone') {
              $scope.oldPhone = contact;
              $scope.user.phone = contact.value;
            }
          }).catch(function (err) {
            FlashService.addAlert({
              type: 'danger',
              msg: err.data.message,
              timeout: 10000
            });
          });
        });
      }).catch(function (err) {
        FlashService.addAlert({
          type: 'danger',
          msg: err.data.message,
          timeout: 10000
        });
      });
    }

    $scope.isValidDate = function () {
      // moment.js takes the month as an array position so:
      // Jan is the month 0, Feb is the month 1 and so on
      // but the user enters it normally
      var tmpDate = angular.extend({}, $scope.date);
      tmpDate.month -= 1;
      var birthdate = moment(tmpDate);
      var dateRange = moment().range(minDate, currentDate);
      if (birthdate.isValid() && dateRange.contains(birthdate)) {
        $scope.profileForm.$setValidity('date', true);
        $scope.user.birthDate = $scope.date.year + '-' + $scope.date.month + '-' + $scope.date.day;
        return true;
      } else {
        $scope.profileForm.$setValidity('date', false);
        return false;
      }
    };

    $scope.updateEmail = function () {
      AuthService.updateEmail($scope.user.email, $scope.user._id).then(function () {
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

    $scope.updateUser = function () {
      $scope.user.userId = $scope.user._id;
      UserService.updateUser($scope.user).then(function () {
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

    $scope.createInfoPhone = function () {
      var phoneInfo = {
        label: 'telephone',
        type: 'telephone',
        value: $scope.user.phone,
        userId: $scope.user._id,
        contactId: $scope.oldPhone.contactId
      };

      UserService.createContact(phoneInfo).then(function (data) {
        phoneInfo.contactId = data.contactId;
        $scope.oldPhone.contactId = data.contactId;
      }).catch(function (err) {
        FlashService.addAlert({
          type: 'danger',
          msg: err.data.message,
          timeout: 10000
        });
      });
    };

    $scope.updateInfoPhone = function () {
      var phoneInfo = {
        label: 'telephone',
        type: 'telephone',
        value: $scope.user.phone,
        userId: $scope.user._id,
        contactId: $scope.oldPhone.contactId
      };
      UserService.contactUpdate(phoneInfo, $scope.user._id).then(function (data) {
        phoneInfo.contactId = data.contactId;
        $scope.oldPhone.contactId = data.contactId;
      }).catch(function (err) {
        FlashService.addAlert({
          type: 'danger',
          msg: err.data.message,
          timeout: 10000
        });
      });
    };

    $scope.updateAthlete = function () {
      $scope.submitted = true;
      $scope.isValidDate();
      if ($scope.profileForm.$dirty && $scope.profileForm.$valid) {
        $scope.updateUser();
      }
      if ($scope.contactForm.$dirty && $scope.contactForm.$valid) {
        // update contact info
        if ($scope.contactForm.email.$dirty) {
          $scope.updateEmail();
        } else if ($scope.contactForm.phone.$dirty && $scope.user.phone && $scope.user.phone !== '') {
          if (Object.keys($scope.oldPhone).length !== 0) {
            // submit user's phone update
            $scope.updateInfoPhone();
          } else {
            // create users's phone
            $scope.createInfoPhone();
          }
        }
      }
    };
  });