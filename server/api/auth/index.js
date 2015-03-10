'use strict';

var express = require('express');
var config = require('../../config/environment');
var authController = require('./auth.controller');

//require('./local/passport').setup(User, config);

var router = express.Router();
router.use('/local', require('./local/index'));
router.use('/facebook', require('./facebook/index'));

router.post('/verify', authController.verify); //get
router.get('/logout', authController.logout);

router.post('/password/reset-request', authController.passwordResetRequest);
router.post('/password/reset', authController.passwordReset);

router.get('/verify-request', authController.verifyRequest);

router.post('/email/update', authController.emailUpdate);
router.post('/password/update', authController.passwordUpdate);

// router.get('/switch', authController.switch);

module.exports = router;