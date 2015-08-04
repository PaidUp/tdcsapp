/**
 * Main application routes
 */

'use strict';
var fs = require('fs');
var config = require('./config/environment');
var errors = require('./components/errors');

module.exports = function(app) {


  app.use(function(req, res, next) {
    fs.stat(config.root+'/var/maintenance.pid', function(err, stat) {
      if(err == null) {
        return res.json(503, {
          'code': 'maintenance',
          'message': 'Site Maintenance: Please try later'
        });
      }else {
        next();
      }
    });
  });

  // Insert routes below
  app.use('/api/v1/payment', require('./api/payment'));
  app.use('/api/v1/commerce', require('./api/commerce'));
  app.use('/api/v1/user', require('./api/user'));
  // app.use('/api/v1/team', require('./api/teams'));
  // app.use('/api/v1/things', require('./api/thing'));
  app.use('/api/v1/application', require('./api/application'));
  app.use('/api/v1/loan', require('./api/loan'));
//  app.use('/api/v1/users', require('./api/users'));

  app.use('/api/v1/auth', require('./api/auth'));

  app.use('/api/v1/notification', require('./api/notifications'));

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      res.sendfile(app.get('appPath') + '/index.html');
    });
};
