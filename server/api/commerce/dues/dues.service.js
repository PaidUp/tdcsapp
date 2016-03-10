'use strict'

var duesService = require('TDCore').duesService;

var PUScheduleConnect = require("pu-schedule-connect");
var config = require('../../../config/environment/index');
var logger = require('../../../config/logger');
//Done


function calculateDues(params , cb){
  var req = {
    baseUrl : config.connections.schedule.baseUrl,
    token : config.connections.schedule.token,
    prices : params
  }


  PUScheduleConnect.calculatePrices(req).exec({
// An unexpected error occurred.
    error: function (err){
      return cb(err);
    },
// OK.
    success: function (result){
      return cb(null, result);
    },
  });
};

module.exports = function(conf){
  if(conf){
    logger.debug('set new configuration' , conf);
    config = conf;
  }

  return {
    calculateDues:calculateDues
  }
}
