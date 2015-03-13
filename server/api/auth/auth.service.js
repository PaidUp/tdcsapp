'use strict';

var TDAuthService = require('TDCore').authService;
var config = require('../../config/environment');

function logout(token, cb) {
  TDAuthService.init(config.TDTokens.user);
  TDAuthService.logout(token, function (err, data) {
    if(err) return cb(err);
    return cb(data);
  });
};

function verifyRequest(userId, cb) {
  TDAuthService.init(config.TDTokens.user);
  TDAuthService.verifyRequest(userId, function (err, data) {
    if(err) return cb(err);
    return cb(data);
  });
};

function verify(data, cb) {
  TDAuthService.init(config.TDTokens.user);
  TDAuthService.verify(data, data.userId, function (err, data){
    if(err) return cb(err);
    return cb(data);
  });
};

function passwordResetRequest(data, cb){
  TDAuthService.init(config.TDTokens.user);
  TDAuthService.passwordResetRequest(data, config.TDTokens.user, function (err, data) {
    if(err) return cb(err);
    return cb(data);
  });
};

function passwordReset(data, cb){
  TDAuthService.init(config.TDTokens.user);
  TDAuthService.passwordReset(req.body, function (err, data) {
    if(err) return cb(err);
    return cb(data);
  });
};

function emailUpdate(data, cb){
  TDAuthService.init(config.TDTokens.user);
  TDAuthService.emailUpdate(data, data.userId, function (err, data) {
    if(err) return cb(err);
    return cb(data);
  });
};

function passwordUpdate(data, cb){
  TDAuthService.init(config.TDTokens.user);
  TDAuthService.passwordUpdate(data, data.userId, function (err, data) { 
    if(err) return cb(err);
    return cb(data);
  });
};

exports.logout = logout;
exports.verifyRequest = verifyRequest;
exports.verify = verify;
exports.passwordResetRequest = passwordResetRequest;
exports.passwordReset = passwordReset;
exports.emailUpdate = emailUpdate;
exports.passwordUpdate = passwordUpdate;