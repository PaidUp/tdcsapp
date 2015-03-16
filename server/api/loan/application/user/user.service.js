'use strict';

var loanUser = require('./user.model');
var Blind = require('blind');
var isValidSSN = require('is-valid-ssn');
var config = require('../../../../config/environment/index');

function save(user, cb) {
  user.save(function(err, data) {
    if(err) {
      return cb(err);
    }
    return cb(null, data);
  });
}

var regExp = /^[a-zA-Z\s]*$/;
function validateFirstNameSync(firstName) {
  if(!regExp.test(firstName) || firstName === '' || firstName === undefined || firstName === null || firstName.length > 128 ){
    return false;
  }
  return true;
}

function validateLastNameSync(lastName) {
  if(!regExp.test(lastName) || lastName === '' || lastName === undefined || lastName === null || lastName.length > 128 ){
    return false;
  }
  return true;
}

function findOne(filter, cb) {
  loanUser.findOne(filter, function(err, data) {
      if(err) {
        return cb(err);
      }
      return cb(null, data);
    }
  );
}

function validateOnlyLetterSync(word) {
  if(!regExp.test(word) || word === '' || word === undefined || word === null){
    return false;
  }
  return true;
}

var encryptKey = config.loan.application.user.encryptKey;
function encryptSSN(ssn){
  var encrypted = new Blind({ encryptKey: encryptKey }).encrypt(ssn);
  return encrypted;
}

function decryptSSN(encryptedSSN){
  var decrypted = new Blind({ encryptKey: encryptKey }).decrypt(encryptedSSN);
  return decrypted;
}

function verifySSN(ssn){
  return isValidSSN(ssn);
}

exports.save = save;
exports.validateFirstNameSync = validateFirstNameSync;
exports.validateLastNameSync = validateLastNameSync;
exports.findOne = findOne;
exports.validateOnlyLetterSync = validateOnlyLetterSync;
exports.encryptSSN = encryptSSN;
exports.decryptSSN = decryptSSN;
exports.verifySSN = verifySSN;