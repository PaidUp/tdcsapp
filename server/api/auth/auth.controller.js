'use strict';

var User = require('../user/user.model.js');
var passport = require('passport');
var config = require('../../config/environment/index');
var jwt = require('jsonwebtoken');
var userService = require('../user/user.service');
var authService = require('./auth.service');
var logger = require('../../config/logger');
/**
 * Change a users password
 */
exports.changePassword = function(req, res, next) {
  var userId = req.user._id;//user login.
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  User.findById(userId, function (err, user) {
    if(user.authenticate(oldPass)) {
      user.password = newPass;
      user.save(function(err) {
        if (err) {
          logger.info(err, err);
          return validationError(res, err);
        }
        res.send(200);
      });
    } else {
      res.send(403);
    }
  });
};

exports.verify = function(req, res, next) {
  var verifyToken = req.body.verifyToken;
  authService.verifyEmail(verifyToken, function(err, data){
    if(err) {
        logger.info(err, err);
        return res.json(400,{
          code: "ValidationError",
          message: "Token is not valid"
        });
    }
    res.send(200);
  });
};

exports.passwordResetRequest = function(req, res, next) {
  var filter = {'email':req.body.email};
  userService.findOne(filter, function(err, data) {
        if (err) {
          logger.info(err, err);
          return res.json(200,err);
        }
        if (!data) return res.send(200,{
          "code": "ValidationError",
          "message": "invalid email."
        });
        authService.ResetPassword(data, function(err, data) {
          if(err){
            logger.info(err, err);
          }
        });
        res.send(200);
  });
};

exports.passwordReset = function(req, res, next) {
  var tokenNewPwd = req.body;
  if(!req.body.verifyToken || !req.body.password){
    return res.json(400,{
      "code": "ValidationError",
      "message": "Missing information."
    });
  }
  authService.verifyPasswordToken(tokenNewPwd, function(err, data){
    if(err) {
      logger.info(err, err);
      return res.json(400,{
        code: "ValidationError",
        message: "Token is not valid"
      });
    }
    res.send(200);
  });
};

/**
 * Log out
 */
exports.logout = function(req, res, next) {
  var token = authService.getTokenFromRequest(req);
  if (token != null) {
    authService.revokeToken(token);
    delete req.user;
  }
  res.send(200);
};

/**
 * Authentication callback
 */
exports.authCallback = function(req, res, next) {
  res.redirect('/');
};

exports.verifyRequest = function(req, res, next) {
  var user = req.user;
  authService.verifyEmailRequest(user, function(err, data) {
    if(err){
      logger.info(err, err);
    }
  });
  res.send(200);
};

/**
* Update password
*/
exports.emailUpdate = function(req, res, next) {
  var userId = req.user._id;
  var userUpdate = req.body.userId;
  var isValidEmail = authService.isValidEmail(req.body.email);
  if(!isValidEmail){
    return res.json(400, {
      "code": "ValidationError",
      "message": "email is not accepted"
    });
  }
  var filter = userId;
  if(userUpdate != userId) {
    filter = {createdBy : userId, _id:userUpdate};
  }
  userService.findOne(filter, function(err, dataUserEmail){
    if(!dataUserEmail){
      return res.json(403, {
        "code": "ValidationError",
        "message": "You don't have permission for this operation"
      });
    }
    dataUserEmail.email = req.body.email;
    userService.save(dataUserEmail, function(err, data) {
      if (err) {
        logger.info(err, err);
        return res.json(500,err);
      }
      if(userUpdate == userId) {
        authService.verifyEmailRequest(data, function(err, data) {
          if(err){
            logger.info(err, err);
          }
        });
      }
      res.send(200);
    });
  });
};

exports.passwordUpdate = function(req, res, next) {
  var userId = req.user._id;
  var validatePassword = authService.validationPasswordSync(req.body.newPassword);
  if(validatePassword != ''){
    return res.json(400,{
      "code": "ValidationError",
      "message": validatePassword
    });
  }
  userService.findOne(userId, function(err, dataUserPass){
    if (err) {
      logger.info(err, err);
      return res.json(500,err);
    }
    if(!dataUserPass){
      return res.json(404,{
        "code": "AuthCredentialNotExists",
        "message": "User Id does not exist"
      });
    }
    var currentPasswordHash = dataUserPass.encryptPassword(req.body.currentPassword);
    if(!dataUserPass.authenticate(req.body.currentPassword)){
      return res.json(400,{
        "code": "ValidationError",
        "message": "Current password is wrong",
      })
    }
    dataUserPass.hashedPassword = dataUserPass.encryptPassword(req.body.newPassword);
    userService.save(dataUserPass, function(err, data) {
      if (err) {
        logger.info(err, err);
        return res.json(500,err);
      }
      res.send(200);
    });
  });
};

exports.switch = function(req, res, next) {
  if(req.user.role === "admin") {
    var token = authService.signToken(req.query.userId, false);
    res.cookie('name', 'tobi', { domain: '.example.com', path: '/admin', secure: true });
    res.writeHead(200, {
      'Set-Cookie': 'token=%22'+token+'%22; Path=/',
      'Content-Type': 'text/plain'
    });
    return res.end(token);
  }
  else {
    res.send(500);
  }
}
