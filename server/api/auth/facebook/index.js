'use strict';

var express = require('express');
var logger = require('../../../config/logger');
var authService = require('../auth.service');
var FB = require('fb');
var User = require('../../user/user.model');
var emailService = require('../auth.email.service');
var userService = require('../../user/user.service');

var router = express.Router();

router.post('/', function(req, res, next) {
  if(!req.body.facebookToken) {
    return res.json(400,{
      "code": "ValidationError",
      "message": "FacebookToken missing parameter."
    });
  }
    FB.setAccessToken(req.body.facebookToken);
    FB.api('/me', function (fbUser) {
      if (fbUser && fbUser.error) {
        if (fbUser.error.code === 'ETIMEDOUT') {
          logger.log(fbUser.error, 'Facebook error: ETIMEDOUT');
        }
        else {
          logger.log(fbUser.error, fbUser.error);
        }
        return res.json(500,{
          code: "UnexpectedError",
          message: "Facebook error",
          errors: fbUser.error
        });
      }
      else {
        if (!fbUser.email) return res.json(400, {
          "code": "ValidationError",
          "message": "Facebook email is required"
        });
        var filter = {$or: [{"facebook.id": fbUser.id}, {"email": fbUser.email}]};
        userService.findOne(filter, function (err, user) {
          if (err) return res.json(500, err);
          if (!user) {
            // create
            userService.createFacebookUser(fbUser, function(err, data) {
              if (err) return res.json(500, err);
              //err
              var token = authService.signToken(data._id);
              return res.json(200, {token : token});
            });
          } else {
            if (!user.facebook.email) {
              // login with merge
              userService.mergeFacebookUser({user:user,fbUser:fbUser}, function(err, data) {
                if (err) return res.json(500, err);
                var token = authService.signToken(data._id);
                return res.json(200, {token: token});
              });
            } else {
              // login
              var token = authService.signToken(user._id);
              return res.json(200, {token: token});
            }
          }
        });
      }
    });
});

module.exports = router;
