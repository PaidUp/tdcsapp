'use strict';

var logger = require('../../../config/logger');
var config = require('../../../config/environment');
let duesService = require('./dues.service')();


exports.calculateDues = function(req , res){

  console.log('req.body', req.body.prices);

  let params = req.body.prices

  duesService.calculateDues(params , function(err, data){
    if (err) {
      return handleError(res, err)
    }
    res.status(200).json(data)
  })
}

function handleError(res, err) {

  logger.error(err);

  var httpErrorCode = err.status;

  return res.status(httpErrorCode).json({errors: err.errors});
}
