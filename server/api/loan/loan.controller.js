'use strict';

var loanService = require('./loan.service');
var loanModel = require('./loan.model');
var config = require('../../config/environment/index');
var moment = require('moment');
var loanApplicationService = require('./application/loanApplication.service');

exports.simulate = function (req, res) {
	var interestRate = config.loan.defaults.interestRate;
	var periodDuration = config.loan.defaults.periodDuration;
	var periodType = config.loan.defaults.periodType;
	var isValidNumberPayments = loanService.isValidNumberPayments(req.body.numberPayments);
	if (!isValidNumberPayments) {
		return res.json(400, {
			"code": "ValidationError",
			"message": "Number of Payments is not accepted"
		});
	}

	var isValidAmount = loanService.isValidAmount(req.body.amount);
	if (!isValidAmount) {
		return res.json(400, {
			"code": "ValidationError",
			"message": "Amount is not accepted"
		});
	}

	loanService.simulate(req.body.amount, req.body.numberPayments, interestRate, periodDuration, periodType, function (err, dataSimulate) {
		if (err) {
			return res.json(409, err);
		}
		dataSimulate.interestRate = interestRate;
		res.json(200, dataSimulate);
	});
};

exports.create = function (req, res) {

	// TODO: valitations coming from loanJS data?
	var userId = req.user._id;
	var filter = {applicantUserId:userId, _id:req.body.applicationId};

  loanApplicationService.findOne(filter, function(err, applicationLoan){

		if(err){
      return res.json(409,err);
    }

    if(!applicationLoan){
      return res.json(403,{
        "code": "PermitionError",
        "message": "Application does not exist."
      });
    }

		// change state acordingly
		//applicationLoan.state = STATE.SIGNED;

		// save the document in mongo

		var loan = new loanModel(req.body);
		loanService.save(loan, function (err, data) {
			if (err) return handleError(res, err);
			return res.json(200, {loanId : data._id});
		});

  });
};

exports.getloan = function (req, res) {

	var loanId = req.params.id;
	var filter = { _id: loanId};

	loanService.findOne(filter, function (err, data) {

		if (err) {
			return res.json(409, err);
		}

		if (!loanId) {
			return res.json(400, {
				"code": "ValidationError",
				"message": "LoanId not provided"
			});
		}

		return res.json(200, data);
	});
};


function handleError(res, err) {
  var httpErrorCode = 500;
  var errors = [];

  if (err.name === "ValidationError") {
    httpErrorCode = 400;
  }

  return res.json(httpErrorCode, {code : err.name, message : err.message, errors : err.errors});
}
