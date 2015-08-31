/**
 * Created by riclara on 8/28/15.
 */

var logger = require('winston');
var logsene = require('winston-logsene');
var config = require('../config/environment');

logger.add(logsene, {
  token: config.logger.token
});

module.exports = logger;
