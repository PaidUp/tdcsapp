'use strict';

var _ = require('lodash');
var TDUserService = require('./user.service');

exports.create = function(req, res) {
  TDUserService.create(req.body, function (data){
    res.json(data);
  });
};

exports.current = function(req, res, next) {
  TDUserService.current(req.query, function (data){
    res.json(data);
  });
};

exports.update = function(req, res, next) {
  TDUserService.update(req.body, function (data){
    res.json(data);
  });
};

exports.find = function(req, res, next) {
  TDUserService.find(req.body, function (data){
    res.json(data);
  });
};