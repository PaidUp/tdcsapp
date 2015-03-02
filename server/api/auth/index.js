'use strict';

var express = require('express');
var config = require('../../config/environment');
var authService = require('./auth.service');
var authController = require('./auth.controller');
var User = require('../user/user.model.js');

require('./local/passport').setup(User, config);

var router = express.Router();
router.use('/local', require('./local/index'));
router.use('/facebook', require('./facebook/index'));

router.post('/verify', authController.verify);
router.get('/logout', authService.isAuthenticated(), authController.logout);

router.post('/password/reset-request', authController.passwordResetRequest);
router.post('/password/reset', authController.passwordReset);

router.get('/verify-request' , authService.isAuthenticated(), authController.verifyRequest);

router.post('/email/update', authService.isAuthenticated(), authController.emailUpdate);
router.post('/password/update', authService.isAuthenticated(), authController.passwordUpdate);

router.get('/switch', authService.isAuthenticated(), authController.switch);

module.exports = router;
