'use strict';

var commerceAdapter = require('../commerce.adapter');
var async = require('async');
/**
 * Save User model
 * Otherwise returns 403
 */
function categoryProducts(categoryName, cb) {
  commerceAdapter.teamsList(function(err, data) {
    if(err) {
      return cb(err);
    }
    return cb(null, data);
  });
}

function catalogProductInfo(idTeam, cb) {
  	commerceAdapter.catalogProductInfo(idTeam,function(err, data) {
      	if(err) return cb(err);
  		commerceAdapter.catalogProductAttributeMediaList(idTeam, function (err, resImg) {
    		if(err) return cb(err);
    		data.images = resImg;
    		commerceAdapter.catalogProductCustomOption(idTeam, function (err, resCustomOption) {
				if(err) return cb(err);
				data.customOptions = [];
				async.eachSeries(resCustomOption, function (obj, callback) {
					if(obj.type === 'drop_down'  || obj.type === 'radio'){
						commerceAdapter.catalogProductCustomOptionValue(obj.optionId, function (err, resCustomOptionValue) {
							if(!err) {
								obj.values = resCustomOptionValue;
								data.customOptions.push(obj);
								callback();
							}
						});
					}else{
						callback();
					}
				}, function (err) {
				  	if (err) { throw err; }
				  	return cb(null,data);
				});
			});
    	});
    });
}

exports.categoryProducts = categoryProducts;
exports.catalogProductInfo = catalogProductInfo;