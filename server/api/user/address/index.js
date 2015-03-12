'use strict';

var express = require('express');
var controller = require('./address.controller');

var router = express.Router();

router.post('/create', controller.create);
router.post('/list/:id', controller.list);
router.get('/load/:id/:addressId', controller.load);
router.put('/update/:id/:addressId', controller.update);
// router.delete('/delete/:id', controller.delete);

module.exports = router;