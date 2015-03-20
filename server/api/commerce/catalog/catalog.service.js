'use strict';

var async = require('async');
var logger = require('../../../config/environment');
var TDCommerceService = require('TDCore').commerceService;
TDCommerceService.init(config.connections.commerce);

function catalogList(categoryId, cb) {
  TDCommerceService.catalogList(categoryId, function(err, data) {
    if(err) return cb(err);
    return cb(null, data);
  });
}

function catalogProductInfo(productId, cb) {
  	TDCommerceService.catalogProductInfo(productId,function(err, data) {
      if(err) return cb(err);
	  	return cb(null,data);
    });
}

exports.catalogList = catalogList;
exports.catalogProductInfo = catalogProductInfo;
