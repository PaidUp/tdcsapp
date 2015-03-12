'use strict';

var express = require('express');
var controller = require('./relation.controller');

var router = express.Router();

router.post('/create', controller.create);
router.get('/list/:id', controller.list);

module.exports = router;