'use strict';

var mongoose = require('mongoose');
var TDUserService = require('TDCore').userService;
var config = require('../../../config/environment');

function create(data, cb) {
  TDUserService.relationCreate(data, config.TDTokens.user, function (err, data) {
    if(err) return cb(err);
    return cb(data);
  });
};

function list(data, cb) {
  TDUserService.relationList(data, config.TDTokens.user, data.id, function (err, data) {
    if(err) return cb(err);
    return cb(data);
  });
};

exports.create = create;
exports.list = list;