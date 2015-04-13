'use strict';

var express = require('express');
var tdAuthService = require('TDCore').authService;
var config = require('../../../config/environment');
var mix = require('../../../config/mixpanel');

var router = express.Router();

router.post('/', function(req, res, next) {
    tdAuthService.init(config.connections.user);
    tdAuthService.facebook(req.body, function (err, data) {
        if(err) res.json(402, err);
        mix.panel.track("facebook",req.body);
        res.json(200, data);
    });
});

module.exports = router;