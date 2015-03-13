'use strict';

var TDUserService = require('TDCore').userService;
var config = require('../../config/environment');

function create (data, cb) {
  TDUserService.init(config.connections.user);
  TDUserService.create(data, function (err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
};

function current (data, cb) {
  TDUserService.init(config.connections.user);
  TDUserService.current(data.token, function (err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
};

function update (data, cb) {
  TDUserService.init(config.connections.user);
  TDUserService.update(data, data.userId, function(err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
};

function find (data, cb) {
  TDUserService.init(config.connections.user);
  TDUserService.find(data, function(err, data){
    if(err) return cb(err);
    return cb(null,data);
  });
};

function save (data, cb) {
  TDUserService.init(config.connections.user);
  TDUserService.save(data, function(err, data){
    if(err) return cb(err);
    return cb(null,data);
  });
};

exports.create = create;
exports.current = current;
exports.update = update;
exports.find = find;
exports.save = save;

