/**
 * Created by riclara on 8/28/15.
 */
'use strict'

angular.module('convenienceApp')
  .service('LoggerService', function ($resource) {

    var logger = $resource('/api/v1/logger/put', {}, {
      send: { method:'POST', isArray: false }
    });

    var LoggerService = this;

    function put(type,  message){
      logger.send({type:type, message:message},function (resp) {
        return resp
      });
    };

    LoggerService.debug = function(message){
      return put('debug' , message);
    };

    LoggerService.info = function(message){
      return put('info' , message);
    };

    LoggerService.warn = function(message){
      return put('warn' , message);
    };

    LoggerService.error = function(message){
      return put('error' , message);
    };

  });
