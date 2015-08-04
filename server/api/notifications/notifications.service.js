/**
 * Created by riclara on 7/28/15.
 */
'use strict';

var emailNotifications = require('../../components/util/notifications/email-notifications');

exports.sendEmailNotification = function(params, cb){
  emailNotifications.sendNotification(params.subject, params.jsonMessage, function(err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
};
