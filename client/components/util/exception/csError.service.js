/**
 * Created by riclara on 8/27/15.
 */
'use strict'

angular.module('convenienceApp')
  .service('ErrorService', function ($resource, $q) {

    this.csError = function(message, name, objDetails){
      this.name = name ? name : 'ErrorService';
      this.message = message;
      this.objDetails = objDetails ? objDetails : {};
    };

    this.csError.prototype = new Error();
    this.csError.prototype.constructor = this.csError;


    })
