'use strict';

angular.module('convenienceApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('user-enrollments', {
        url: '/user/enrollments',
        templateUrl: 'app/user/enrollments/enrollments.html',
        controller: 'EnrollmentsCtrl',
        auth: true,
        data:{
          roles:['user']
        }
      });
  });