'use strict';

var async = require('async');
var config = require('../../../config/environment');
var tdCommerceService = require('TDCore').commerceService;
tdCommerceService.init(config.connections.commerce);

function catalogList (categoryId, cb) {
	tdCommerceService.init(config.connections.commerce);
  tdCommerceService.catalogCategory(categoryId, function(err, data) {
    if(err) return cb(err);
    return cb(null, data);
  });
}

function catalogProduct (productId, cb) {
	tdCommerceService.init(config.connections.commerce);
	tdCommerceService.catalogProduct(productId,function(err, data) {
    if(err) return cb(err);
  	return cb(null, data);
  });
}

exports.catalogList = catalogList;
exports.catalogProduct = catalogProduct;