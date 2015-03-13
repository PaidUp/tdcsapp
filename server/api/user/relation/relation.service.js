'use strict';

var TDUserService = require('TDCore').userService;
var config = require('../../../config/environment');

function create(data, cb) {
  TDUserService.init(config.TDTokens.user);
  TDUserService.relationCreate(data, function (err, data) {
    if(err) return cb(err);
    return cb(data);
  });
};

function list(userId, cb) {
  TDUserService.init(config.TDTokens.user);
  TDUserService.relationList(userId, function (err, data) {
    if(err) return cb(err);
    return cb(data);
  });
};

exports.create = create;
exports.list = list;