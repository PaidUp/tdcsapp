'use strict';

var express = require('express');
var passport = require('passport');
var authService = require('../auth.service.js');
var userService = require('../../user/user.service');
var User = require('../../user/user.model');
var logger = require('../../../config/logger');
var router = express.Router();

router.post('/signup', function(req, res, next) {
  if(!authService.isValidEmail(req.body.email)){
    return res.json(400,{
      "code": "ValidationError",
      "message": "Email is not valid"
    });
  }
  var validatePassword = authService.validationPasswordSync(req.body.password);
  if(validatePassword != ''){
    return res.json(400,{
      "code": "ValidationError",
      "message": validatePassword
    });
  }
  var filter = {email: req.body.email};
  userService.findOne(filter, function(err, dataUserEmail){
    if(!dataUserEmail){
      User.findById(req.body.userId, function (err, user) {
        if(!user){
          return res.json(404,{
            "code": "AuthCredentialNotExists",
            "message": "User Id does not exist"
          });
        }
        if(user.createdBy != null || user.email != null || user.hashedPassword != null){
          return res.json(403,{
            "code": "AuthCredentialPermission",
            "message": "You don't have permission for this operation"
          });
        }
        user.email = req.body.email;
        user.password = req.body.password;//here

        userService.save(user, function(err, data) {
          if (err) return res.json(500,err);
          authService.verifyEmailRequest(data, function(err, data) {
            logger.log(err, err);
          });
          var token = authService.signToken(data._id);
          res.json(200, { token: token });
        });
      });
    }else{
      return res.json(409,{
        "code": "AuthCredentialExists",
        "message": "Email is already in use"
      });
    }
  });  
});

router.post('/login', function(req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    var error = err || info;
    if (error) return res.json(401, error);
    if (!user) return res.json(404, {message: 'Something went wrong, please try again.'});
    var token = authService.signToken(user._id, req.body.rememberMe);
    res.json({token: token});
  })(req, res, next)
});

module.exports = router;
