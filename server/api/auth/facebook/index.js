'use strict';

var express = require('express');
var FB = require('fb');
var TDAuthService = require('TDCore').authService;
var config = require('../../../config/environment');

var router = express.Router();

router.post('/', function(req, res, next) {
  TDAuthService.facebook(req.body, config.TDTokens.user, function (err, data) {
    res.json(data);
  });
});

module.exports = router;