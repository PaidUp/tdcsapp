'use strict'

var paymentService = require('../payment.service');
var camelize = require('camelize');

exports.updateCustomer = function (req, res) {
  var data = {accountId:req.user.meta.TDPaymentId,data:{default_source:req.body.cardId}}
  paymentService.updateCustomer(data, function(err, data){
    if (err){
      handleError(res, err);
    }
    return res.json(200,data);
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
