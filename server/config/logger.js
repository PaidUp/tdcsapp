/**
 * Created by riclara on 8/28/15.
 */

var logger = require('winston')
var logsene = require('winston-logsene')

logger.add(logsene, {
  token: 'f5ea6cdf-b8c0-44ca-962f-1328873c5974'
});

module.exports = logger;
