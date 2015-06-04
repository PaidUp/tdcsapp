'use strict';

var tdUserService = require('TDCore').userService;
var config = require('../../config/environment');

function create (data, cb) {
  tdUserService.init(config.connections.user);
  tdUserService.create(data, function (err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
};

function current (data, cb) {
  tdUserService.init(config.connections.user);
  tdUserService.current(data.token, function (err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
};

function update (data, cb) {
  tdUserService.init(config.connections.user);
  tdUserService.update(data, data.userId, function(err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
};

function find (filter, cb) {
  tdUserService.init(config.connections.user);
  tdUserService.find(filter, function(err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
};

function save (data, cb) {
  tdUserService.init(config.connections.user);
  tdUserService.save(data, function(err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
};

exports.create = create;
exports.current = current;
exports.update = update;
exports.find = find;
exports.save = save;
