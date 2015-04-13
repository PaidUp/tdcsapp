'use strict';

var loanApplicationService = require('./loanApplication.service');
var userService = require('./user/user.service');
var mix = require('../../../config/mixpanel');

exports.simulate = function(req, res) {
  mix.panel.track("simulateAppLoan", mergeDataMixpanel(req.body, req.user._id));
  loanApplicationService.simulate(req.body, function (err, dataSimulate) {
    if (err) return res.json(409, err);
    res.json(200, dataSimulate);
  });
};

exports.create = function(req, res) {
  req.body.userId = req.user._id;
  mix.panel.track("createAppLoan", mergeDataMixpanel(req.body, req.user._id));
  loanApplicationService.create(req.body, function (err, data){
  	if (err) return res.json(409, err);
  	res.json(200, data);
  });
};

exports.state = function(req, res) {
  mix.panel.track("stateAppLoan", mergeDataMixpanel(req.body, req.user._id));
   loanApplicationService.state(req.body, function (err, data){
     if (err) return res.json(409, err);
     res.json(200, data);
   });
};

exports.sign = function(req, res) {
  if (req.user) {
    req.body.applicantUserId = req.user._id;
    mix.panel.track("signAppLoan", mergeDataMixpanel(req.body, req.user._id));
  }
  userService.sign(req.body, function (err, sign){
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
  mix.panel.track("paymentAppLoan", mergeDataMixpanel(req.body, req.user._id));
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

exports.getcontract = function (req, res) {
  req.body.userId = req.user._id;
  loanApplicationService.contract(req.body, function (err, data){
    if (err) return res.json(409, err);
    res.json(200, data);
  });
};

function mergeDataMixpanel(data, userId){
  return mix.mergeDataMixpanel(data, userId);
}
