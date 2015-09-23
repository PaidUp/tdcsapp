'use strict';

var _ = require('lodash');
var userService = require('./user.service');
var mix = require('../../config/mixpanel');

exports.create = function(req, res) {
  mix.panel.track("createUser", req.body);
  userService.create(req.body, function (err, data){
    if(err) res.json(402, err);
    res.json(200, data);
  });
};

exports.current = function(req, res, next) {
  mix.panel.track("currentUser", {});
  userService.current(req.query, function (err, data){
    if(err) res.json(402, err);
    res.json(200, data);
  });
};

exports.update = function(req, res, next) {
  mix.panel.track("updateUser", req.body);
  console.log('req.body',req.body);
  userService.update(req.body, function (err, data){
    if(err) res.json(402, err);
    res.json(200, data);
  });
};

exports.find = function(req, res, next) {
  userService.find(req.body, function (err, data){
    mix.panel.track("findUser", mix.mergeDataMixpanel(req.body, req.user._id));
    if(err) res.json(402, err);
    res.json(200, data);
  });
};
