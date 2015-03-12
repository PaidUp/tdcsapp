'use strict';

var mongoose = require('mongoose');
var moment = require('moment');
var userService = require('TDCore').userService;
var config = require('../../config/environment');

function create (data, cb) {
  userService.create(data, config.TDTokens.user, function (err, data){
    if(err) return cb(err);
    return cb(data);
  });
};

function current (data, cb) {
  userService.current(data, config.TDTokens.user, data.token, function (err, data){
    if(err) return cb(err);
    return cb(data);
  });
};

function update (data, cb) {
  userService.update(data, config.TDTokens.user, data.userId, function(err, data){
    if(err) return cb(err);
    return cb(data);
  });
};

function find (data, cb) {
  userService.find(data, config.TDTokens.user, data.userId, function(err, data){
    if(err) return cb(err);
    return cb(data);
  });
};

exports.create = create;
exports.current = current;
exports.update = update;
exports.find = find;