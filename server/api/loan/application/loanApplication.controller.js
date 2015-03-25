'use strict';

var loanApplicationService = require('./loanApplication.service');

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
	console.log('req.body', req.body);
  loanApplicationService.save(req.body, function (err, data){
  	console.log('err', err);
  	console.log('data', data);
  	if (err) return res.json(409, err);
  	res.json(200, data);
  });
};

// exports.state = function(req, res) {
//   //TODO
//   /*
//   /api/v1/loan/application/state POST
//   request: only ACCEPTED_USER or DECLINED_USER
//   response: true or InvalidParams
//   validates: application.state == APPLIED
//   */

//   //validate if state is valid

//   var isValidState = loanApplicationService.validateState(req.body.state);
//   if(!isValidState){
//     return res.json(400, {
//       "code": "ValidationError",
//       "message": "Loan application state is not accepted"
//     });
//   }

//   var filter = {state:STATE.APPLIED, applicantUserId:req.user._id, _id:req.body.applicationId};

//   loanApplicationService.findOne(filter, function(err, applicationLoan){
//     if(err){
//       return res.json(409,err);
//     }
//     if(!applicationLoan){
//         return res.json(403,{
//           "code": "ValidationError",
//           "message": "Application loan error. Missing permissions"
//         });
//       }
//     applicationLoan.state = req.body.state;
//     loanApplicationService.save(applicationLoan, function(err, data){
//       if(err){
//         return res.json(409,err);
//       }
//       return res.json(200,true);
//     });
//   });
// };

// exports.sign = function(req, res) {
//   var periodDuration = config.loan.defaults.periodDuration;
//   var periodType = config.loan.defaults.periodType;
//   var filter = {state:STATE.APPLIED, applicantUserId:req.user._id, _id:req.body.applicationId};
//   loanApplicationService.findOne(filter, function(err, applicationLoan){
//     if(err){
//       return res.json(409,err);
//     }
//     if(!applicationLoan){
//       return res.json(403,{
//         "code": "PermitionError",
//         "message": "Application loan error. Missing permissions"
//       });
//     }
//     var filterUser = {_id:applicationLoan.meta[0].userId};
//     userLoanService.findOne(filterUser, function(err, dataUser){
//       if(err){
//         return res.json(409,err);
//       }
//       if(!dataUser || dataUser.firstName != req.body.firstName || dataUser.lastName != req.body.lastName){
//         return res.json(400,{
//           "code": "ValidationError",
//           "message": "First name or Last name does not match with your application."
//         });
//       }
//       var ssn = userLoanService.decryptSSN(dataUser.ssn);
//       if(req.body.ssn !== ssn.substring(ssn.length-4,ssn.length)){
//         return res.json(400,{
//           "code": "ValidationError",
//           "message": "SSN does not match with your application."
//         });
//       }

//       applicationLoan.state = STATE.SIGNED;
//       loanApplicationService.save(applicationLoan, function(err, dataApplicationLoan){
//         if(err){
//           return res.json(409,err);
//         }

//         loanService.simulate(dataApplicationLoan.amount, dataApplicationLoan.numberPayments, dataApplicationLoan.interestRate, periodDuration, periodType,function(err, applicationSimulate){

//           //Here create loan.
//           var loan = new loanModel({
//             schedule: applicationSimulate.installments,
//             amount: applicationSimulate.amount,
//             interestSum: applicationSimulate.interestSum,
//             capitalSum: applicationSimulate.capitalSum,
//             sum: applicationSimulate.sum,
//             applicationId: req.body.applicationId,
//             state:'active',
//             interestRate:dataApplicationLoan.interestRate
//           });
//           loanService.save(loan, function (err, dataLoan) {

//             /*contractEmail.sendContractEmail(dataUser, dataLoan, function(err, data) {
//               if(err){
//                 logger.info(err, err);
//               }
//             });*/
//             if (err) return handleError(res, err);
//             return res.json(200, {loanId : dataLoan._id});

//           });

//         });
//       });
//     });
//   });
// };

// exports.payment = function(req, res) {
//   var isValidAba = loanApplicationService.validateABA(req.body.aba);
//   if(!isValidAba){
//     return res.json(400, {
//       "code": "ValitationError",
//       "message": "ABA is not acepted."
//     });
//   }

//   var isValidDda = loanApplicationService.validateDDA(req.body.dda);
//   if(!isValidDda){
//     return res.json(400, {
//       "code": "ValitationError",
//       "message": "DDA is not acepted."
//     });
//   }

//   var filter = {_id:req.body.applicationId, state:STATE.SIGNED, applicantUserId:req.user._id};
//   loanApplicationService.findOne(filter, function(err, applicationLoan){
//     if(err){
//       return res.json(409,err);
//     }
//     if(!applicationLoan){
//       return res.json(401, {
//         "code": "PermitionError",
//         "message": "Application could not be changed or does not exist."
//       });
//     }
//     applicationLoan.state = STATE.APPROVED;
//     loanApplicationService.save(applicationLoan, function(err, data){
//       if(err){
//         return res.json(409,err);
//       }
//       return res.json(200,true);
//     });
//   });
// };

// exports.application = function(req, res) {

//     var filter = {_id:req.params.id}
//     loanApplication.findOne(filter, function(err, applicationData){
//       if(!applicationData){
//       return res.json(400, {
//           "code": "ValidationError",
//           "message": "loan Application not exist."
//         });
//       };
//       res.json(200,applicationData);
//     });
// };

// function handleError(res, err) {
//   var httpErrorCode = 500;
//   var errors = [];

//   if(err.name === "ValidationError") {
//     httpErrorCode = 400;
//   }

//   return res.json(httpErrorCode, {code : err.name, message : err.message, errors : err.errors});
// }


// exports.getcontract = function (req, res) {

//   var periodDuration = config.loan.defaults.periodDuration;
//   var periodType = config.loan.defaults.periodType;
//   var filter = {
//     state: STATE.APPLIED,
//     applicantUserId: req.user._id,
//     _id: req.body.applicationId
//   };

//   loanApplicationService.findOne(filter, function (err, applicationLoan) {

//     if (err) {
//       return res.json(409, err);
//     }
//     if (!applicationLoan) {
//       return res.json(403, {
//         "code": "PermitionError",
//         "message": "Application loan error. Missing permissions"
//       });
//     }
//     var filterUser = {
//       _id: applicationLoan.meta[0].userId
//     };
//     userLoanService.findOne(filterUser, function (err, dataUser) {

//       if (err) {
//         return res.json(409, err);
//       }

//       loanService.simulate(applicationLoan.amount, applicationLoan.numberPayments, applicationLoan.interestRate, periodDuration, periodType, function (err, applicationSimulate) {

//         //Here create loan.
//         var loan = new loanModel({
//           schedule: applicationSimulate.installments,
//           amount: applicationSimulate.amount,
//           interestSum: applicationSimulate.interestSum,
//           capitalSum: applicationSimulate.capitalSum,
//           sum: applicationSimulate.sum,
//           applicationId: req.body.applicationId,
//           state: 'active',
//           interestRate: applicationLoan.interestRate
//         });

//         contractEmail.getContractHtml(dataUser, loan, function (data) {
//           return res.json(200, {html:data});
//         });

//       });
//     });

//   });
// };
