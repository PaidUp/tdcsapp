'use strict';

angular.module('convenienceApp')
  .service('DuesService', function ($cookieStore, $q, $resource) {

    var calculateDuesPost = $resource("/api/v1/commerce/dues/calculate", {}, {});


    this.calculateDues = function(params, cb){
      calculateDuesPost.save(null, {prices: params}).$promise.then(function(data){
        cb(null, data.body);
      }).catch(function(err){
        cb(err);
      });
    };



  });
