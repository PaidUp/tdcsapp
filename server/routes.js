/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');

module.exports = function(app) {

  // Insert routes below
  app.use('/api/v1/payment', require('./api/payment'));
  // app.use('/api/v1/commerce', require('./api/commerce'));
  app.use('/api/v1/user', require('./api/user'));
  // app.use('/api/v1/team', require('./api/teams'));
  // app.use('/api/v1/things', require('./api/thing'));
  // app.use('/api/v1/application', require('./api/application'));
  // app.use('/api/v1/loan', require('./api/loan'));
//  app.use('/api/v1/users', require('./api/users'));

  app.use('/api/v1/auth', require('./api/auth'));

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      res.sendfile(app.get('appPath') + '/index.html');
    });
};
