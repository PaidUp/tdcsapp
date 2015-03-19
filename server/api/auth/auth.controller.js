'use strict';

var authService = require('./auth.service');

exports.logout = function(req, res, next) {
  authService.logout(req.query.token, function (err, data) {
    if(err) res.json(402, err);
    res.json(200, data);
  });
};

exports.verifyRequest = function(req, res, next) {
  authService.verifyRequest(req.params.userId, function (err, data) {
    if(err) res.json(402, err);
    res.json(200, data);
  });
};

exports.verify = function(req, res, next) {
  authService.verify(req.body, function (err, data){
    if(err) res.json(402, err);
    res.json(200, data);
  });
};

exports.passwordResetRequest = function(req, res, next) {
  authService.passwordResetRequest(req.body, function (err, data) {
    if(err) res.json(402, err);
    res.json(200, data);
  });
};

exports.passwordReset = function(req, res, next) {
  authService.passwordReset(req.body, function (err, data) {
    if(err) res.json(402, err);
    res.json(200, data);
  });
};

exports.emailUpdate = function(req, res, next) {
  authService.emailUpdate(req.body, req.params.userId, function (err, data) {
    if(err) res.json(402, err);
    res.json(200, data);
  });
};

exports.passwordUpdate = function(req, res, next) {
  authService.passwordUpdate(req.body, req.params.userId, function (err, data) { 
    if(err) res.json(402, err);
    res.json(200, data);
  });
};