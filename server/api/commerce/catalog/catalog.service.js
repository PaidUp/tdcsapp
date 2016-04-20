'use strict';

var async = require('async');
var config = require('../../../config/environment');
var tdCommerceService = require('TDCore').commerceService;
tdCommerceService.init(config.connections.commerce);

function catalogList (categoryId, cb) {
	tdCommerceService.init(config.connections.commerce);
  tdCommerceService.catalogCategoryV2(categoryId, function(err, data) {
    if(err) return cb(err);
    return cb(null, data);
  });
}

function groupedList (productId, cb) {
  tdCommerceService.init(config.connections.commerce);
  tdCommerceService.catalogProductV2(productId, function(err, data) {
    if(err) return cb(err);
    return cb(null, data);
  });
}

function evalDate(strDate){
  let result = "";
  let orgDate = new Date(strDate);
  let today = new Date();
  if(orgDate.getTime() < today.getTime()){
    let dt = new Date(today.toLocaleDateString()).toISOString();
    console.log('DTT ' , dt);
    result = dt.substring(0,10);
  }else{
    result = strDate
  }
  return result;
}

function catalogProduct (productId, cb) {
	tdCommerceService.init(config.connections.commerce);
	tdCommerceService.catalogProduct(productId,function(err, data) {
    if(err) return cb(err);
    try{
      if(data.feeManagement){
        let fm = JSON.parse(data.feeManagement)
        for (var key in fm.paymentPlans) {
          fm.paymentPlans[key].dues.forEach(function(ele, idx, arr){
            ele.dateCharge = evalDate(ele.dateCharge);
          });
          data.feeManagement = JSON.stringify(fm);
        }
      }
      return cb(null, data);

    }catch (e){
      console.log(e)
      cb(e);
    }
  });
}

function catalogCreate (productData, cb) {
  tdCommerceService.init(config.connections.commerce);
  tdCommerceService.catalogCreate(productData,function(err, product) {
    if(err) return cb(err);
    return cb(null, product);
  });
}

exports.catalogList = catalogList;
exports.catalogProduct = catalogProduct;
exports.catalogCreate = catalogCreate;
exports.groupedList = groupedList;
