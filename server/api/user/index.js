'use strict';

var express = require('express');
var controller = require('./user.controller');
var authService = require('../auth/auth.service');

var router = express.Router();

router.post('/create', controller.create);
// router.get('/current', authService.isAuthenticated(), controller.me);
// router.post('/update', authService.isAuthenticated(), controller.update);

// router.use('/contact', require('./contact/index'));
// router.use('/address', require('./address/index'));
// router.use('/relation', require('./relation/index'));


// router.get('/:id', authService.isAuthenticated(), controller.getUser);
module.exports = router;