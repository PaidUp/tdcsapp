/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /things              ->  index
 * POST    /things              ->  create
 * GET     /things/:id          ->  show
 * PUT     /things/:id          ->  update
 * DELETE  /things/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var path = require('path');
var config = require('../../config/environment');
var nodemailer = require('nodemailer');
var emailTemplates = require('email-templates');

var transporter = nodemailer.createTransport(config.emailService);

exports.sendWelcomeEmail = function(user, cb) {
  emailTemplates(config.emailTemplateRoot,function(err,template){
    if(err) return cb(err);
    var emailVars = config.emailVars;
    emailVars.fullName = user.getFullName();
    template('auth/welcome',emailVars,function(err, html, text){
      if(err) return cb(err);
      var mailOptions = config.emailOptions;
      mailOptions.to = user.email;
      mailOptions.bcc = config.emailContacts.developer;
      mailOptions.html = html;
      mailOptions.subject = 'Welcome to ' + emailVars.companyName;
      mailOptions.attachments = [];

      transporter.sendMail(mailOptions, function(error, info){
        if(error){
          return cb(err);
        }else{
          return cb(null, info);
        }
      });
    });
  });
};

exports.sendWelcomeTokenEmail = function(user, token, cb) {
  emailTemplates(config.emailTemplateRoot,function(err,template){
    if(err) return cb(err);
    var emailVars = config.emailVars;
    emailVars.fullName = user.firstName + ' ' +user.lastName;//user.getFullName();
    emailVars.token = token;
    template('auth/welcome', emailVars,function(err, html, text){
      if(err) return cb(err);
      var mailOptions = config.emailOptions;
      mailOptions.to = user.email;
      mailOptions.bcc = config.emailContacts.developer;
      mailOptions.html = html;
      mailOptions.subject = 'Welcome to ' + emailVars.companyName;
      mailOptions.attachments = [];
      transporter.sendMail(mailOptions, function(error, info){
        if(error){
          return cb(err);
        }else{
          return cb(null, info);
        }
      });
    });
  });
};

exports.sendResetTokenEmail = function(user, token, cb) {
  emailTemplates(config.emailTemplateRoot,function(err,template){
    if(err) return cb(err);
    var emailVars = config.emailVars;
    emailVars.fullName = user.getFullName();
    emailVars.token = token;
    template('auth/reset', emailVars,function(err, html, text){
      if(err) return cb(err);
      var mailOptions = config.emailOptions;
      mailOptions.to = user.email;
      mailOptions.bcc = config.emailContacts.developer;
      mailOptions.html = html;
      mailOptions.subject = 'Reset Password ' + emailVars.companyName;
      mailOptions.attachments = [];
      transporter.sendMail(mailOptions, function(error, info){
        if(error){
          return cb(err);
        }else{
          return cb(null, info);
        }
      });
    });
  });
};
