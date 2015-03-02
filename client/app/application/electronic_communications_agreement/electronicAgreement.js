'use strict';

angular.module('convenienceApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('electronic-comunication-agreement', {
        url: '/electronic-comunication-agreement',
        templateUrl: 'app/application/electronic_communications_agreement/electronic_agreement.html'
      });
  });