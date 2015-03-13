'use strict';

var _ = require('lodash');
var userService = require('./user.service');

exports.create = function(req, res) {
  userService.create(req.body, function (data){
    res.json(data);
  });
};

exports.current = function(req, res, next) {
  userService.current(req.query, function (data){
    res.json(data);
  });
};

exports.update = function(req, res, next) {
  userService.update(req.body, function (data){
    res.json(data);
  });
};

exports.find = function(req, res, next) {
  userService.find(req.body, function (data){
    res.json(data);
  });
};