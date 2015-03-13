'use strict';

var TDUserService = require('TDCore').userService;
var config = require('../../../config/environment');

function create(data, cb) {
  TDUserService.init(config.connections.user);
  TDUserService.contactCreate(data, data.userId, function (err, data){
    if(err) return cb(err);
    return cb(data);
  });
};

function list(data, cb) {
  TDUserService.init(config.connections.user);
  TDUserService.contactList(data, data.userId, function (err, data){
    if(err) return cb(err);
    return cb(data);
  });
};

function load(data, cb) {
  TDUserService.init(config.connections.user);
  TDUserService.contactLoad(data.userId, data.contactId, function (err, data){
    if(err) return cb(err);
    return cb(data);
  });
};

function update(data, cb) {
  TDUserService.contactUpdate(data, data.userId, data.contactId, function (err, data){
    if(err) return cb(err);
    return cb(data);
  });
};

// function delete(data, cb) {
//   TDUserService.contactDelete(
//     data,
//     config.TDTokens.user,
//     data.userId,
//     data.contactId,
//     function (err, data){
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
