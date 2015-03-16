'use strict';

var express = require('express');
var controller = require('./catalog.controller');
var authService = require('../../auth/auth.service');

var router = express.Router();

router.get('/category/teams', authService.isAuthenticated(), controller.teamList);
router.get('/product/:id', authService.isAuthenticated(), controller.catalogInfo);

module.exports = router;