'use strict';

var express = require('express');
var tdAuthService = require('TDCore').authService;
var config = require('../../../config/environment');

var router = express.Router();

router.post('/', function(req, res, next) {
	tdAuthService.init(config.connections.user);
  tdAuthService.facebook(req.body, function (err, data) {
    if(err) res.json(402, err);
    res.json(200, data);
  });
});

module.exports = router;