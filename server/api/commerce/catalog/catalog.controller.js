'use strict';

var _ = require('lodash');
var catalogService = require('./catalog.service');
var logger = require('../../../config/environment');

// Creates a new user in the DB.
exports.list = function(req, res) {
  var categoryId = 0;
  if(req.body.category == 'teams') {
    categoryId = config.commerce.category.teams;
  }
  catalogService.catalogList(categoryId, function(err, dataService){
    if(err) return handleError(res, err);
    res.json(200, dataService);
  });
}

exports.catalogInfo = function(req, res) {
  if(!req.params && !req.params.id) {
    return res.json(400, {
      "code": "ValidationError",
      "message": "Product Id is required"
    });
  }
  catalogService.catalogProductInfo(req.params.id, function(err, dataService){
    if(err) return handleError(res, err);
    res.json(200, dataService);
  });
}

function handleError(res, err) {
  var httpErrorCode = 500;
  var errors = [];

  if(err.name === "ValidationError") {
    httpErrorCode = 400;
  }

  return res.json(httpErrorCode, {code : err.name, message : err.message, errors : err.errors});
}
