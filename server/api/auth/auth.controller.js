'use strict';

var authService = require('./auth.service');

exports.logout = function(req, res, next) {
  authService.logout(req.query.token, function (data) {
    res.json(data);
  });
};

exports.verifyRequest = function(req, res, next) {
  authService.verifyRequest(req.params.id, function (data) {
    res.json(data);
  });
};

exports.verify = function(req, res, next) {
  authService.verify(req.body, function (data){
    res.json(data);
  });
};

exports.passwordResetRequest = function(req, res, next) {
  authService.passwordResetRequest(req.body, function (data) {
    res.json(data);
  });
};

exports.passwordReset = function(req, res, next) {
  authService.passwordReset(req.body, function (data) {
    res.json(data);
  });
};

exports.emailUpdate = function(req, res, next) {
  authService.emailUpdate(req.body, function (data) {
    res.json(data);
  });
};

exports.passwordUpdate = function(req, res, next) {
  authService.passwordUpdate(req.body, function (data) { 
    res.json(data);
  });
};