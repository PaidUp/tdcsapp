'use strict';

angular.module('convenienceApp')
  .controller('aboutUsCtrl', function ($scope, TrackerService) {
    TrackerService.pageTrack();
    var descriptions = {
      allan: 'Allan is a father of three super active boys who are very involved with youth sports.  In fact, ' +
      'that’s partially how PaidUp came to be.  Allan is very active himself and has founded a few other ' +
      'organizations over the past ten years or so.  Allan also comes from a banking background and understands the ' +
      'importance of solid business practices and wants to assist youth sports organizations in every way possible.  ' +
      'Allan primarily handles sales so if you are a prospective customer you’ll probably end up talking to him on the ' +
      'phone one day!  The thing Allan is most proud of related to PaidUp is the product and support we ' +
      'provide to coaches so they can focus more time, resources and attention on our children across the U.S.',
      felipe: 'Felipe is a parent as well and has a strong interest in supporting youth sports organizations ' +
      'because he knows his children will be participating one day soon.  Felipe brings the technical expertise to ' +
      'the organization and really has a heart for creating the best experience possible for parents interacting ' +
      'with our company.  Felipe primarily handles support and manages the client experience.  If you are a parent ' +
      'or coach with a question or need related to payments you’ll probably be working with him one day.  The thing ' +
      'Felipe is most proud of related to PaidUp is how we get to solve real issues for real people.'
    }

    $scope.descriptions = {};

    $scope.getDescription = function (name) {
      if ($scope.descriptions[name].isFull) {
        $scope.descriptions[name].content = descriptions[name];
      } else {
        $scope.descriptions[name].content = descriptions[name].substring(0, 320) + '...'
      }
      $scope.descriptions[name].isFull = !$scope.descriptions[name].isFull;
    }

    $scope.init = function () {
      for (var name in descriptions) {
        $scope.descriptions[name] = {
          isFull : true,
          content : descriptions[name].substring(0, 320) + '...'
        }
      }
    }
  });
