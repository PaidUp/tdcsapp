'use strict';

var TDUserService = require('TDCore').userService;
var config = require('../../../config/environment');
 
function create(data, cb) {
  TDUserService.addressCreate(data, config.TDTokens.user, data.userId, function (err, data){
    if(err) return cb(err);
    return cb(data);
  });
};

function list(data, cb) {
  TDUserService.addressList(
    data, 
    config.TDTokens.user, 
    data.userId, 
    function (err, data){
      if(err) return cb(err);
    	return cb(data);
    }
  );
};

function load(data, cb) {
  TDUserService.addressLoad(
    data, 
    config.TDTokens.user, 
    data.id, 
    data.addressId, 
    function (err, data){
      if(err) return cb(err);
      return cb(data);
    }
  );
};

function update(data, cb) {
  TDUserService.addressUpdate(
    data, 
    config.TDTokens.user, 
    data.userId, 
    data.addressId, 
    function (err, data){
      if(err) return cb(err);
      return cb(data);
    }
  );
};

// function delete(data, cb) {
//   TDUserService.addressDelete(
//     data, 
//     config.TDTokens.user, 
//     data.userId, 
//     data.addressId, 
//     function (data){
//       if(err) return cb(err);
//       return cb(data);
//     }
//   );
// };

exports.create = create;
exports.list = list;
exports.load = load;
exports.update = update;
// exports.delete = delete;