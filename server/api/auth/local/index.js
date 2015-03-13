'use strict';

var express = require('express');
var TDAuthService = require('TDCore').authService;
var config = require('../../../config/environment');

var router = express.Router();

router.post('/signup', function(req, res, next) {
	TDAuthService.init(config.TDTokens.user);
  TDAuthService.signup(req.body, function(err, data){
    res.json(data);
  });
});

router.post('/login', function(req, res, next) {
  TDAuthService.init(config.TDTokens.user);
  TDAuthService.login(req.body, function(err, data){
    res.json(data);
  });
});

module.exports = router;