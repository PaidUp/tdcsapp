'use strict';

var passport = require('passport');
var jwt = require('jsonwebtoken');
var TDAuthService = require('TDCore').authService;
var config = require('../../config/environment');


// * Log out
exports.logout = function(req, res, next) {
  TDAuthService.logout(req.body, config.TDTokens.user, req.query.token, function (err, data) {
    res.json(data);
  });
};
// * End log out

// * Verify 
exports.verifyRequest = function(req, res, next) {
  TDAuthService.verifyRequest(req.body, config.TDTokens.user, req.body.userId, function (err, data) {
    res.json(data);
  });
};

exports.verify = function(req, res, next) {
  console.log('req.body', req.body);
  TDAuthService.verify(req.body, config.TDTokens.user, req.body.userId, function (err, data){
    res.json(data);
  });
};
// * End verify

// * Password reset
exports.passwordResetRequest = function(req, res, next) {
  TDAuthService.passwordResetRequest(req.body, config.TDTokens.user, function (err, data) {
    res.json(data);
  });
};

exports.passwordReset = function(req, res, next) {
  TDAuthService.passwordReset(req.body, config.TDTokens.user, function (err, data) {
    res.json(data);
  });
};
// * End password reset

// *  Email update
exports.emailUpdate = function(req, res, next) {
  TDAuthService.emailUpdate(req.body, config.TDTokens.user, req.body.userId, function (err, data) {
    res.json(data);
  });
};
// * End email update

// * Update password
exports.passwordUpdate = function(req, res, next) {
  TDAuthService.passwordUpdate(req.body, config.TDTokens.user, req.body.userId, function (err, data) { 
    res.json(data);
  });
};
// * End update password

/**
 * Change a users password
 */
// exports.changePassword = function(req, res, next) {
//   var userId = req.user._id;//user login.
//   var oldPass = String(req.body.oldPassword);
//   var newPass = String(req.body.newPassword);

//   User.findById(userId, function (err, user) {
//     if(user.authenticate(oldPass)) {
//       user.password = newPass;
//       user.save(function(err) {
//         if (err) {
//           logger.info(err, err);
//           return validationError(res, err);
//         }
//         res.send(200);
//       });
//     } else {
//       res.send(403);
//     }
//   });
// };

/**
 * Authentication callback
 */
// exports.authCallback = function(req, res, next) {
//   res.redirect('/');
// };

// exports.switch = function(req, res, next) {
//   if(req.user.role === "admin") {
//     var token = authService.signToken(req.query.userId, false);
//     res.cookie('name', 'tobi', { domain: '.example.com', path: '/admin', secure: true });
//     res.writeHead(200, {
//       'Set-Cookie': 'token=%22'+token+'%22; Path=/',
//       'Content-Type': 'text/plain'
//     });
//     return res.end(token);
//   }
//   else {
//     res.send(500);
//   }
// }