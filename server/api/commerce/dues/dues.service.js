'use strict'

var duesService = require('TDCore').duesService;
var config = require('../../../config/environment/index');
var logger = require('../../../config/logger');
//Done


function generateDues(params , cb){
  duesService.generateDues(params, function(err , data){
    if(err){
      return cb(err);
    }
    cb(null, data);
  })
};

module.exports = function(conf){
  if(conf){
    logger.debug('set new configuration' , conf);
    config = conf;
  }
  duesService.init(config.connections.schedule);

  return {
    generateDues:generateDues
  }
}
