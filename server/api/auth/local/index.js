'use strict';

var express = require('express');
var passport = require('passport');
var TDAuthService = require('TDCore').authService;
var config = require('../../../config/environment');

var router = express.Router();

router.post('/signup', function(req, res, next) {
  TDAuthService.signup(req.body, config.TDTokens.user, function(err, data){
    res.json(data);
  });
});

router.post('/login', function(req, res, next) {
  TDAuthService.login(req.body, config.TDTokens.user, function(err, data){
    res.json(data);
  });
});

module.exports = router;