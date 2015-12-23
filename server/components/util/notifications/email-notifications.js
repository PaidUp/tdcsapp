/**
 * Created by riclara on 7/28/15.
 */
'use strict';

var config = require('../../../config/environment');
var nodemailer = require('nodemailer');
var emailTemplates = require('email-templates');
var transporter = nodemailer.createTransport(config.emailService);
var logger = require('../../../config/logger')

exports.sendNotification = function (subject, jsonMessage, cb) {
  try{

    var email = config.emailContacts.admin;
    emailTemplates(config.emailTemplateRoot, function (err, template) {

      if (err) return cb(err);
      var emailVars = config.emailVars;
      var arrMsj = [];
      for(var key in jsonMessage){
        arrMsj.push(key+': '+jsonMessage[key]);
      }
      emailVars.arrMsj = arrMsj;
      template('notifications', emailVars, function (err, html, text) {
        if (err) return cb(err);
        var mailOptions = config.emailOptionsAlerts;
        mailOptions.html = html;
        mailOptions.to = email;
        //mailOptions.bcc = config.emailContacts.developer;
        mailOptions.subject = emailVars.prefix + subject + emailVars.companyName;
        mailOptions.attachments = [];
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            return cb(error);
          } else {
            return cb(null, info);
          }
        });
        //return cb(err, null);
      });
    });

  }catch(e){
    return cb(e, null);
  }
};

exports.sendPlaceOrderErrorNotification = function (userFirstName, email) {
  try{

    //var email = config.emailContacts.admin;
    emailTemplates(config.emailTemplateRoot, function (err, template) {

      if (err){
        logger.error(err);
        return false;
      }
      var emailVars = config.emailVars;
      logger.debug('name user' , userFirstName);
      emailVars.userFirstName = userFirstName;

      template('notificationsPlaceOrderError', emailVars, function (err, html, text) {
        if (err) {
          logger.error(err);
          return false;
        }
        var mailOptions = config.emailOptionsAlerts;
        mailOptions.html = html;
        mailOptions.to = email;
        //mailOptions.bcc = config.emailContacts.developer;
        mailOptions.subject = emailVars.prefix + 'Problem to complete your order ' + emailVars.companyName;
        mailOptions.attachments = [];

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            logger.error(err);
            return false;
          } else {
            return true;
          }
        });
        //return cb(err, null);
      });
    });

  }catch(e){
    logger.error(e);
    return false;
  }
};
