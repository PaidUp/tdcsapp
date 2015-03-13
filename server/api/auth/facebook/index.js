'use strict';

var express = require('express');
var TDAuthService = require('TDCore').authService;
var config = require('../../../config/environment');

var router = express.Router();

router.post('/', function(req, res, next) {
	TDAuthService.init(config.TDTokens.user);
  TDAuthService.facebook(req.body, function (err, data) {
    res.json(data);
  });
});

module.exports = router;