'use strict';

var _ = require('lodash');
var userService = require('./user.service');

exports.create = function(req, res) {
  userService.create(req.body, function (err, data){
    if(err) res.json(402, err);
    res.json(200, data);
  });
};

exports.current = function(req, res, next) {
  userService.current(req.query, function (err, data){
    if(err) res.json(402, err);
    res.json(200, data);
  });
};

exports.update = function(req, res, next) {
  userService.update(req.body, function (err, data){
    if(err) res.json(402, err);
    res.json(200, data);
  });
};

exports.find = function(req, res, next) {
  userService.find(req.body, function (err, data){
    if(err) res.json(402, err);
    res.json(200, data);
  });
};