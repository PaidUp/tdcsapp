'use strict'

var webhookService = require('./webhook.service');
var camelize = require('camelize');

exports.webpost = function (req, res) {
  console.log('req.body',req.body);
  webhookService.sendEmail(req.body, function(err, data){
    console.log('err',err);
    console.log('data',data);
    return res.json(200,{webhook:"POST"});
  });
};

exports.webget = function (req, res) {
  console.log('req.params',req.params);
  console.log('req.query',req.query);
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
