'use strict';

angular.module('convenienceApp')
  .controller('CreateAthleteCtrl', function ($scope, UserService, $rootScope, $state, FlashService, ModalFactory) {
    // ======== Create Athelete
    var currentDate = moment();
    var minDate = moment().subtract(60, 'year');
    var currentUser = $rootScope.currentUser;
    $scope.modalFactory = ModalFactory;
    $scope.renderSubmit = true;

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
        $scope.athlete.birthDate = $scope.date.year + '-' + $scope.date.month + '-' + $scope.date.day;
        return true;
      } else {
        $scope.addAthleteForm.$setValidity('date', false);
        return false;
      }
    };

    $scope.createChild = function () {
      UserService.save($scope.athlete, function(data){
        $scope.athlete.userId = data.userId;
        // if ($scope.addAthleteForm.phone.$dirty && $scope.athlete.phone !== '') {
        //   $scope.createInfoPhone();
        // }
        UserService.createRelation(currentUser._id, data.userId, 'child').then(function () {
          //angular.element('#addAthlete').modal('toggle');
          $scope.submitted = false;
          $scope.addAthleteForm.$setPristine();
          delete $scope.athlete;
          delete $scope.date;
          $scope.modalFactory.closeModal();
          $state.go('athletes', {}, {reload: true});
        }).catch(function (err) {
          $scope.error = err.data.message;
        });
      }, function(err){
        $scope.error = err.message;
      });
    };

    $scope.createInfoPhone = function () {
      var phoneInfo = {
        label: 'telephone',
        type: 'telephone',
        value: $scope.athlete.phone,
        userId: $scope.athlete.userId
      };

      UserService.createContact(phoneInfo).then(function (data) {
        phoneInfo.contactId = data.contactId;
      }).catch(function (err) {
        FlashService.addAlert({
          type: 'danger',
          msg: err.data.message,
          timeout: 10000
        });
      });
    };

    $scope.register = function () {
      $scope.submitted = true;
      $scope.isValidDate();
      if ($scope.addAthleteForm.$valid) {
        $scope.renderSubmit = false;
        $scope.createChild();
      }
    };
  });

angular.module('convenienceApp')
  .controller('DatepickerCtrl', function ($scope) {
    $scope.dt = new Date().getTime();

    $scope.clear = function () {
      $scope.dt = null;
    };

    // Disable weekend selection
    $scope.disabled = function(date, mode) {
      return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
    };

    $scope.toggleMin = function() {
      $scope.minDate = $scope.minDate ? null : new Date();
    };
    $scope.toggleMin();

    $scope.open = function($event) {
      $event.preventDefault();
      $event.stopPropagation();

      $scope.opened = true;
    };

    $scope.dateOptions = {
      formatYear: 'yy',
      startingDay: 1
    };

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];
  });

angular.module('convenienceApp')
  .controller('AccordionCtrl', function ($scope) {
  $scope.oneAtATime = true;

  $scope.groups = [
    {
      title: 'Dynamic Group Header - 1',
      content: 'Dynamic Group Body - 1'
    },
    {
      title: 'Dynamic Group Header - 2',
      content: 'Dynamic Group Body - 2'
    }
  ];

  $scope.items = ['Item 1', 'Item 2', 'Item 3'];

  $scope.addItem = function() {
    var newItemNo = $scope.items.length + 1;
    $scope.items.push('Item ' + newItemNo);
  };

  $scope.status = {
    isFirstOpen: true,
    isFirstDisabled: false
  };
});

angular.module('convenienceApp')
  .controller('TabsCtrl', function ($scope, $window) {
  $scope.tabs = [
    { title:'Shedule', content:'Dynamic content 1' },
    { title:'Shedule 2', content:'Dynamic content 2'}
  ];

  $scope.alertMe = function() {
    setTimeout(function() {
      $window.alert('You\'ve selected the alert tab!');
    });
  };
});

angular.module('convenienceApp')
  .controller('CarouselDemoCtrl', function () {
  });
