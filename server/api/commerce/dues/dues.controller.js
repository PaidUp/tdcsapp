'use strict';

var logger = require('../../../config/logger');
var commerceService = require('../commerce.service');
var config = require('../../../config/environment');
//var mix = require('../../../config/mixpanel');
let duesService = require('./dues.service')();


exports.generateDues = function(req , res){

  duesService.generateDues(req.body , function(err, data){
    if (err) {
      return handleError(res, err)
    }
    res.status(200).json({data})
  })
}

function handleError(res, err) {
  console.log('err',err)
  console.log('err.name',err.name)
  var httpErrorCode = 500;
  var errors = [];

  if(err.name === "ValidationError" || err.name === "Magento Error") {
    httpErrorCode = 400;
  }
  logger.log('error', err);

  return res.status(httpErrorCode).json({code : err.name, message : err.message, errors : err.errors});
}
