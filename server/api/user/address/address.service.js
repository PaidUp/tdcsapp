'use strict';

var TDUserService = require('TDCore').userService;
var config = require('../../../config/environment');

function create(data, cb) {
  TDUserService.init(config.connections.user);
  TDUserService.addressCreate(data, data.userId, function (err, data){
    if(err) return cb(err);
    return cb(data);
  });
};

function list(data, cb) {
  TDUserService.init(config.connections.user);
  TDUserService.addressList(data, data.userId, function (err, data){
    if(err) return cb(err);
    return cb(data);
  });
};

function load(data, cb) {
  TDUserService.init(config.connections.user);
  TDUserService.addressLoad(data.id, data.addressId, function (err, data){
    if(err) return cb(err);
    return cb(data);
  });
};

function update(data, cb) {
  TDUserService.init(config.connections.user);
  TDUserService.addressUpdate(data, data.userId, data.addressId, function (err, data){
    if(err) return cb(err);
    return cb(data);
  });
};

// function delete(data, cb) {
//  TDUserService.init(config.TDTokens.user);
//   TDUserService.addressDelete(
//     data,
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
