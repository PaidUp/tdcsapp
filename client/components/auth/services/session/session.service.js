'use strict';

angular.module('convenienceApp')
  .service('SessionService', function ($cookieStore, $rootScope) {

    var SessionService = this;
    $rootScope.$on('postlogout', function () {
      SessionService.removeCurrentSession();
    });

    this.addSession = function(data) {
      $cookieStore.put('token', data.token);
    };

    this. removeCurrentSession = function() {
      $cookieStore.remove('token');
    };

    this.getCurrentSession = function() {
      return $cookieStore.get('token');
    };
  });
