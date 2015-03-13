'use strict';

var express = require('express');
var TDAuthService = require('TDCore').authService;
var config = require('../../../config/environment');

var router = express.Router();

router.post('/signup', function(req, res, next) {
	TDAuthService.init(config.connections.user);
  TDAuthService.signup(req.body, function (err, data){
  	if(err) res.json(402, err);
    res.json(200, data);
  });
});

router.post('/login', function(req, res, next) {
  TDAuthService.init(config.connections.user);
  TDAuthService.login(req.body, function (err, data){
  	if(err) res.json(402, err);
    res.json(200, data);
  });
});

module.exports = router;
