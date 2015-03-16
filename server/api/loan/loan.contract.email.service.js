'use strict';

var _ = require('lodash');
var path = require('path');
var config = require('../../config/environment');
var nodemailer = require('nodemailer');
var emailTemplates = require('email-templates');
var userLoanService = require('./application/user/user.service');
var moment = require('moment');
var loanService = require('./loan.service');
var contractService = require('./loan.contract.service');
var commerceAdapter = require('../commerce/commerce.adapter');

var transporter = nodemailer.createTransport(config.emailService);
//2
function sendContractEmail (loanUser, loan, cb) {
  var emailVars = config.emailVars;
  var contractTemplate = setContractData(loanUser, loan);
  contractTemplate.contractData.isEmail = true;

  var userAddressLoan = contractTemplate.searchData.userAddressLoan;
  var userPhone = contractTemplate.searchData.userPhone;
  var userEmail = contractTemplate.searchData.userEmail;

  emailVars.name = loanUser.firstName;
  emailVars.userId = loanUser._id;

  commerceAdapter.orderLoad(loan.orderId, function (err, magentoOrder) {
    var team = 'Convenience Select';
    if(!err && magentoOrder){
      team = magentoOrder.products[0].productSku.replace(/_/g, ' ');
    }
     
    emailTemplates(config.emailTemplateRoot, function (err, template) {

      if (err) return cb(err);

      // crear PDF
      contractService.createPdfContract(contractTemplate, function (errPDF, contractPDF) {
        template('loan/application', emailVars, function (err, html, text) {
          if (err) return cb(err);

          var mailOptions = config.emailOptions;
          mailOptions.to = userEmail;
          mailOptions.bcc = config.emailContacts.admin + "," + config.emailContacts.developer;

          mailOptions.html = html;
          mailOptions.subject = 'Your Loan Documents – ' + team;

          mailOptions.attachments = [
            {
              filename: contractPDF,
              path: contractPDF
          }];
          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              return cb(err);
            } else {
              return cb(null, info);
            }
          });

        });

      });
    });
  });

};


function getContractHtml (loanUser, loan, cb) {

  var emailVars = config.emailVars;
  var contractTemplate = setContractData(loanUser, loan);
  contractTemplate.contractData.isEmail = false;

  contractService.createHtmlContract(contractTemplate, function(html){

    return cb(html);

  });

};

function setContractData (loanUser, loan) {
  // dinamic data for the email

  var contractTemplate = {};
  contractTemplate.searchData = {};
  var searchData = {};

  // find loan address
  var i;
  for (i = 0; i < loanUser.addresses.length; i++) {
    if (loanUser.addresses[i].type === 'loan') {
      contractTemplate.searchData.userAddressLoan = loanUser.addresses[i];
      break;
    }
  };

  // find loan phone number
  var i;
  for (i = 0; i < loanUser.contacts.length; i++) {
    if (loanUser.contacts[i].type === 'telephone') {
      contractTemplate.searchData.userPhone = loanUser.contacts[i].value;
      break;
    }
  };

  // find loan mail
  var i;
  for (i = 0; i < loanUser.contacts.length; i++) {
    if (loanUser.contacts[i].type === 'email') {
      contractTemplate.searchData.userEmail = loanUser.contacts[i].value;
      break;
    }
  };

  var ssn = userLoanService.decryptSSN(loanUser.ssn);
  var last4snn = ssn.substring(ssn.length - 4, ssn.length);
  var todayNow = new moment().format("MMMM DD, YYYY");

  contractTemplate.contractData = config.contractData;

  var i;
  for (i=0; i<loan.schedule.length; i++) {
    loan.schedule[i].paymentDay = new moment(loan.schedule[i].paymentDay).format("dddd, MMMM Do YYYY");
  };

  contractTemplate.contractData.platform = {
    date: todayNow,
    contractNo: loan.orderId,
    dateofNote: todayNow,
    annualPercentageRate: parseFloat(config.loan.defaults.interestRate).toFixed(2),
    financeCharge: parseFloat(loan.interestSum).toFixed(2),
    amountFinanced: parseFloat(loan.amount).toFixed(2),
    totalOfPayments: parseFloat(loan.sum).toFixed(2),
    numberOfPayments: loan.schedule.lenght,
    amountOfPayment: loan.schedule[0].installment,
    whenPaymentsAreDue: loan.schedule[0].paymentDay,
    installmentAccountHandlingCharge: parseFloat(loan.interestSum).toFixed(2),
    effectiveDate: todayNow,
    schedule: loan.schedule
  };

  contractTemplate.contractData.client = {
    borrower: loanUser.firstName + ', ' + loanUser.lastName,
    address: contractTemplate.searchData.userAddressLoan.address1,
    city: contractTemplate.searchData.userAddressLoan.city,
    state: contractTemplate.searchData.userAddressLoan.state,
    zip: contractTemplate.searchData.userAddressLoan.zipCode,
    phone: contractTemplate.searchData.userPhone,
    name: loanUser.firstName,
    lastName: loanUser.lastName,
    last4ssn: last4snn
  };

  return contractTemplate;

};


exports.getContractHtml = getContractHtml;
exports.sendContractEmail = sendContractEmail;
