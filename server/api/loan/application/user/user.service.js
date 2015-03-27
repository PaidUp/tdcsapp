'use strict';

var config = require('../../../../config/environment');
var tdUserService = require('TDCore').userService;

function create (user, cb) {
  tdUserService.init(config.connections.userLoan);
  tdUserService.create(user, function (err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
}

function findOne(filter, cb) {
  tdUserService.init(config.connections.userLoan);
  tdUserService.find(filter, function (err, data) {
    if(err) {return cb(err);}
    return cb(null, data);
  });
}

function sign (user, cb) {
  tdUserService.init(config.connections.userLoan);
  tdUserService.sign(user, function (err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
}

// var regExp = /^[a-zA-Z\s]*$/;
// function validateFirstNameSync(firstName) {
//   if(!regExp.test(firstName) || firstName === '' || firstName === undefined || firstName === null || firstName.length > 128 ){
//     return false;
//   }
//   return true;
// }

// function validateLastNameSync(lastName) {
//   if(!regExp.test(lastName) || lastName === '' || lastName === undefined || lastName === null || lastName.length > 128 ){
//     return false;
//   }
//   return true;
// }



// function validateOnlyLetterSync(word) {
//   if(!regExp.test(word) || word === '' || word === undefined || word === null){
//     return false;
//   }
//   return true;
// }

exports.create = create;
exports.findOne = findOne;
// exports.validateFirstNameSync = validateFirstNameSync;
// exports.validateLastNameSync = validateLastNameSync;
// exports.validateOnlyLetterSync = validateOnlyLetterSync;