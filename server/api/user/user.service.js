'use strict';

var TDUserService = require('TDCore').userService;
var config = require('../../config/environment');

function create (data, cb) {
  TDUserService.init(config.TDTokens.user);
  TDUserService.create(data, function (err, data){
    if(err) return cb(err);
    return cb(data);
  });
};

function current (data, cb) {
  TDUserService.init(config.TDTokens.user);
  TDUserService.current(data.token, function (err, data){
    if(err) return cb(err);
    return cb(data);
  });
};

function update (data, cb) {
  TDUserService.init(config.TDTokens.user);
  TDUserService.update(data, data.userId, function(err, data){
    if(err) return cb(err);
    return cb(data);
  });
};

function find (data, cb) {
  TDUserService.init(config.TDTokens.user);
  TDUserService.find(data, data.userId, function(err, data){
    if(err) return cb(err);
    return cb(data);
  });
};

exports.create = create;
exports.current = current;
exports.update = update;
exports.find = find;