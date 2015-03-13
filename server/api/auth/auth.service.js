'use strict';

var TDAuthService = require('TDCore').authService;
var config = require('../../config/environment');
var compose = require('composable-middleware');
var tdUserService = require('TDCore').userService;


/**
 * Attaches the user object to the request if authenticated
 * Otherwise returns 403
 */
function isAuthenticated() {
  return compose()
    // Validate token jwt and redis
    .use(function(req, res, next) {
      var token = getTokenFromRequest(req);
      req.headers.authorization = 'Bearer ' + token;
      tdUserService.init(config.connections.user);
      tdUserService.current(token, function(err, data){
        if(err)
          next(err);
        if(data._id){
          req.user =  data;
          return next();
        }else{
          return res.send(401);
        }
      });
    })
}

/**
 * Get the token from HTTP Request
 * @param req
 * @returns {*}
 */
function getTokenFromRequest(req) {
  var token = null;
  // allow access_token to be passed through query parameter as well
  if(req.query && req.query.hasOwnProperty('token')) {
    token = req.query.token;
  }
  else if(req.body && req.body.token){
    token = req.body.token;
  }
  else if(req.query && req.query.hasOwnProperty('access_token')) {
    token = req.query.token;
  }else if(req.headers.authorization){
    token = req.headers.authorization.slice(7,req.headers.authorization.length);
  }
  return token;
};

function logout(token, cb) {
  TDAuthService.init(config.connections.user);
  TDAuthService.logout(token, function (err, data) {
    if(err) return cb(err);
    return cb(data);
  });
};

function verifyRequest(userId, cb) {
  TDAuthService.init(config.connections.user);
  TDAuthService.verifyRequest(userId, function (err, data) {
    if(err) return cb(err);
    return cb(data);
  });
};

function verify(data, cb) {
  TDAuthService.init(config.connections.user);
  TDAuthService.verify(data, data.userId, function (err, data){
    if(err) return cb(err);
    return cb(data);
  });
};

function passwordResetRequest(data, cb){
  TDAuthService.init(config.connections.user);
  TDAuthService.passwordResetRequest(data, config.connections.user, function (err, data) {
    if(err) return cb(err);
    return cb(data);
  });
};

function passwordReset(data, cb){
  TDAuthService.init(config.connections.user);
  TDAuthService.passwordReset(req.body, function (err, data) {
    if(err) return cb(err);
    return cb(data);
  });
};

function emailUpdate(data, cb){
  TDAuthService.init(config.connections.user);
  TDAuthService.emailUpdate(data, data.userId, function (err, data) {
    if(err) return cb(err);
    return cb(data);
  });
};

function passwordUpdate(data, cb){
  TDAuthService.init(config.connections.user);
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
exports.isAuthenticated = isAuthenticated;
