'use strict';

var TDUserService = require('TDCore').userService;
var config = require('../../../config/environment');

function create(data, cb) {
  TDUserService.init(config.connections.user);
  TDUserService.relationCreate(data, function (err, data) {
    if(err) return cb(err);
    return cb(null, data);
  });
};

function list(userId, cb) {
  TDUserService.init(config.connections.user);
  TDUserService.relationList(userId, function (err, data) {
    if(err) return cb(err);
    return cb(null, data);
  });
};

exports.create = create;
exports.list = list;