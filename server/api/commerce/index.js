'use strict';

var express = require('express');

var router = express.Router();

router.use('/cart', require('./cart/index'));
router.use('/catalog', require('./catalog/index'));
router.use('/checkout', require('./checkout/index'));
router.use('/order', require('./order/index'));
router.use('/transaction', require('./transaction/index'));

module.exports = router;
