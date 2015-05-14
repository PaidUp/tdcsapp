'use strict';

angular.module('convenienceApp')
  .service('providerService', function ($cookieStore, $q, $resource, $rootScope) {
    var Provider = $resource('/api/v1/commerce/provider/:action', {}, {});
    var LoanService = this;

    this.providerRequest = function(providerInfo){
        Provider.save({action: 'request'},{providerInfo: providerInfo}).$promise;
    }
    
  });