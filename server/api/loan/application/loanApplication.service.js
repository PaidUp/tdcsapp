'use strict';

var loanApplicationModel = require('./loanApplication.model');
var aba = require('ABAValidator').ABAValidator;
var tdLoanApplicationService = require('TDCore').loanApplicationService;
var config = require('../../../config/environment');


function save (loanApplication, cb) {
  tdLoanApplicationService.init(config.connections.loan);
  tdLoanApplicationService.save(loanApplication, function (err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
}

function simulate (dataSimulate, cb) {
  tdLoanApplicationService.init(config.connections.loan);
  tdLoanApplicationService.simulate(dataSimulate, function (err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
}


// function validateState(state) {
//     if(state === 'APPLIED' || state === 'ACCEPTED_CREDIT_CHECK' || state === 'DENIED_CREDIT_CHECK' || state === 'SIGNED' || state === 'APPROVED'){
//         return true;
//     }
//     return false;
// }

// function sign(user, cb) {
//     return cb(null, true);
// }

// function payment(user, cb) {
//     return cb(null, true);
// }

// function isValidIncomeType(incomeType){
// 	if(typeof incomeType === 'string' && incomeType != ''){
// 		return true;
// 	}
// 	return false;
// }


function findOne(filter, cb){
  tdLoanApplicationService.init(config.connections.loan);
  tdLoanApplicationService.find(filter, function(err , data){
    if(err) {
      return cb(err);
    }
    return cb(null, data[0]);
  });
}

// function validateABA(abaNum) {
//   return aba.validate(abaNum);
// }

// function validateDDA(ddaNum) {
//   if(ddaNum.length < 4) {
//     return false;
//   }
//   return true;
// }

exports.save = save;
exports.simulate = simulate;
//exports.validateState = validateState;
//exports.sign = sign;
///exports.payment = payment;
//exports.isValidIncomeType = isValidIncomeType;
exports.findOne = findOne;
//exports.validateABA = validateABA;
//exports.validateDDA = validateDDA;