'use strict';

var loanService = require('./loan.service');

exports.simulate = function (req, res) {
	loanService.simulate(req.body, function (err, dataSimulate) {
		if (err) return res.json(409, err);
		res.json(200, dataSimulate);
	});
};

exports.create = function (req, res) {
  loanService.create(req.body, function (err, dataCreate) {
    if (err) return res.json(409, err);
    res.json(200, dataCreate);
  });
};

exports.getloan = function (req, res) {
  loanService.findOne(req.body, function (err, data) {
    if (err) return res.json(409, err);
    res.json(200, data);
  });
};


// function handleError(res, err) {
//   var httpErrorCode = 500;
//   var errors = [];

//   if (err.name === "ValidationError") {
//     httpErrorCode = 400;
//   }

//   return res.json(httpErrorCode, {code : err.name, message : err.message, errors : err.errors});
// }
