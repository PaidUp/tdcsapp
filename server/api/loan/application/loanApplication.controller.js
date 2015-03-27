'use strict';

var loanApplicationService = require('./loanApplication.service');
var userService = require('./user/user.service');

// var config = require('../../../config/environment/index');
// var contractEmail = require('../loan.contract.email.service');
// var logger = require('../../../config/logger');

// var STATE = {
//   APPLIED: "APPLIED",
//   ACCEPTED_CREDIT_CHECK: "ACCEPTED_CREDIT_CHECK",
//   DENIED_CREDIT_CHECK: "DENIED_CREDIT_CHECK",
//   SIGNED: "SIGNED",
//   APPROVED:"APPROVED"
// };

exports.simulate = function(req, res) {
  loanApplicationService.simulate(req.body, function (err, dataSimulate) {
    if (err) return res.json(409, err);
    res.json(200, dataSimulate);
  });
};

exports.create = function(req, res) {
  req.body.userId = req.user._id;
  loanApplicationService.create(req.body, function (err, data){
  	if (err) return res.json(409, err);
  	res.json(200, data);
  });
};

exports.state = function(req, res) {
   loanApplicationService.state(req.body, function (err, data){
     if (err) return res.json(409, err);
     res.json(200, data);
   });
};

exports.sign = function(req, res) {
  req.body.userId = req.user._id;
  userService.sign(req.body.loanUser, function (err, sign){
    if (err) return res.json(409, err);
    if (sign.isCorrect) {
      loanApplicationService.sign(req.body, function (err, data){
        if (err) return res.json(409, err);
        res.json(200, data);
      });
    }else {
      res.json(400, {
        "code": "ValidationError",
        "message": "sign is not accepted"
      });
    } 
  });
};

exports.payment = function(req, res) {
  loanApplicationService.payment(req.body, function (err, data){
    if (err) return res.json(409, err);
    res.json(200, data);
  });
};

exports.application = function(req, res) {
  loanApplicationService.findOne(req.params.id, function (err, applicationData){
     if(!applicationData){
       return res.json(400, {
         "code": "ValidationError",
         "message": "loan Application not exist."
       });
    };
  res.json(200,applicationData);
  });
};

// function handleError(res, err) {
//   var httpErrorCode = 500;
//   var errors = [];

//   if(err.name === "ValidationError") {
//     httpErrorCode = 400;
//   }

//   return res.json(httpErrorCode, {code : err.name, message : err.message, errors : err.errors});
// }


exports.getcontract = function (req, res) {
  req.body.userId = req.user._id;
  loanApplicationService.contract(req.body, function (err, data){
    if (err) return res.json(409, err);
    res.json(200, data);
  });
};
