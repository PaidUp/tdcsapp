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

function createProduct (productData, cb) {
  console.log('createProduct');
  tdCommerceService.init(config.connections.commerce);
  //tdCommerceService.createProduct(productData,function(err, product) {
    //if(err) return cb(err);
    return cb(null, 'product');
  //});
}

exports.catalogList = catalogList;
exports.catalogProduct = catalogProduct;
exports.createProduct = createProduct;