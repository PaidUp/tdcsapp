'use strict';

var express = require('express');
var controller = require('./contact.controller');

var router = express.Router();

router.post('/create', controller.create);
router.post('/list/:id', controller.list);
router.get('/load/:id/:contactId', controller.load);
router.put('/update/:id', controller.update);
//router.delete('/delete/:id', controller.delete);

module.exports = router;