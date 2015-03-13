'use strict';

var express = require('express');
var authController = require('./auth.controller');

var router = express.Router();
router.use('/local', require('./local/index'));
router.use('/facebook', require('./facebook/index'));

router.post('/verify', authController.verify);
router.get('/logout', authController.logout);

router.post('/password/reset-request', authController.passwordResetRequest);
router.post('/password/reset', authController.passwordReset);

router.get('/verify-request/:id', authController.verifyRequest);

router.post('/email/update', authController.emailUpdate);
router.post('/password/update', authController.passwordUpdate);

module.exports = router;