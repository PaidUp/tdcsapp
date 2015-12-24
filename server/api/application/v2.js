'use strict';

var express = require('express');
var controller = require('./application.controller');
var config = require('../../config/environment');
var router = express.Router();
var auth = require('TDCore').authCoreService;

router.get('/cron', auth.isAuthenticatedServer(config.connections.me.token), controller.cronV2);

module.exports = router;
