'use strict'

var webhookService = require('./webhook.service');
var camelize = require('camelize');

exports.webpost = function (req, res) {
  webhookService.sendEmail(req.body, function(err, data){
    return res.json(200,{webhook:"POST"});
  });
};

exports.webget = function (req, res) {
  webhookService.sendEmail(req.query, function(err, data){
    return res.json(200,{webhook:"GET"});
  });
};

function handleError(res, err) {
  var httpErrorCode = 500;
  var errors = [];

  if (err.name === "ValidationError") {
    httpErrorCode = 400;
  }

  return res.json(httpErrorCode, {
    code: err.name,
    message: err.message,
    errors: err.errors
  });
}
