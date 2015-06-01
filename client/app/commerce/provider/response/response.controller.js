'use strict';

angular.module('convenienceApp')
  .controller('ProviderResponseCtrl', function ($scope, providerService, UserService, $state) {
    providerService.providerResponse($state.params.id).then(function(data){
        $state.go('provider-success'); 
    }).catch(function(err){
        console.log(err);
    });
  });