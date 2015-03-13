'use strict';

var TDAuthService = require('TDCore').authService;
var config = require('../../config/environment');

function logout(data, token, cb) {
  TDAuthService.logout(data, config.TDTokens.user, token, function (err, data) {
    if(err) return cb(err);
    return cb(data);
  });
};

function verifyRequest(data, cb) {
  TDAuthService.verifyRequest(data, config.TDTokens.user, data.id, function (err, data) {
    if(err) return cb(err);
    return cb(data);
  });
};

function verify(data, cb) {
  TDAuthService.verify(data, config.TDTokens.user, data.userId, function (err, data){
    if(err) return cb(err);
    return cb(data);
  });
};

function passwordResetRequest(data, cb){
  TDAuthService.passwordResetRequest(data, config.TDTokens.user, function (err, data) {
    if(err) return cb(err);
    return cb(data);
  });
};

function passwordReset(data, cb){
  TDAuthService.passwordReset(req.body, config.TDTokens.user, function (err, data) {
    if(err) return cb(err);
    return cb(data);
  });
};

function emailUpdate(data, cb){
  TDAuthService.emailUpdate(req.body, function (err, data) {
    if(err) return cb(err);
    return cb(data);
  });
};

function passwordUpdate(data, cb){
  TDAuthService.passwordUpdate(data, config.TDTokens.user, data.userId, function (err, data) { 
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