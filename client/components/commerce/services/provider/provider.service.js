'use strict';

angular.module('convenienceApp')
  .service('providerService', function ($cookieStore, $q, $resource, $rootScope) {
    var Provider = $resource('/api/v1/commerce/provider/:action/:id', {}, {});
    var LoanService = this;

    this.providerRequest = function(providerInfo){
        return Provider.save({action: 'request'},{providerInfo: providerInfo}).$promise;
    }

    this.providerResponse = function(providerId){
        return Provider.get({action: 'response',id: providerId}).$promise;
    }
    
  });