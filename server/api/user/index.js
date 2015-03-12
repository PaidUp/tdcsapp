'use strict';

var express = require('express');
var config = require('../../config/environment');
var controller = require('./user.controller');

var router = express.Router();

router.post('/create', controller.create);
router.get('/current', controller.current);
router.post('/update', controller.update);

router.use('/contact', require('./contact/index'));
router.use('/address', require('./address/index'));
router.use('/relation', require('./relation/index'));

router.post('/:id', controller.find);
module.exports = router;