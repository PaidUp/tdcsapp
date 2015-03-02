'use strict';

angular.module('convenienceApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('user-card-create', {
        url: '/user/card/create',
        templateUrl: 'app/user/cards/userCardCreate.html',
        auth: true
      });
  });