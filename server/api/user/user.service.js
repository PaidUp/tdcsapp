'use strict';

var mongoose = require('mongoose');
var User = require('./user.model.js');
var moment = require('moment');
var authEmailService = require('../auth/auth.email.service');
/**
 * Save User model
 * Otherwise returns 403
 */
function save(user, cb) {
  user.save(function(err, data) {
    if(err) {
      return cb(err);
    }
    return cb(null, data);
  });
}
function create(user, cb) {
  User.create(user, function(err, data) {
      if(err) {
        return cb(err);
      }
      return cb(null, data);
    }
  );
}
function findOne(filter, cb) {
  User.findOne(filter, function(err, data) {
      if(err) {
        return cb(err);
      }
      return cb(null, data);
    }
  );
}
function update(user, cb) {
  User.update(user, function(err, data) {
      if(err) {
        return cb(err);
      }
      return cb(null, data);
    }
  );
}

function updateFilter(filter, fields, upsert, cb) {
  User.update(filter, fields, upsert, function(err, data) {
      if(err) {
        return cb(err);
      }
      return cb(null, data);
    }
  );
}

function findOneFilter(filter,fields, cb) {
  User.findOne(filter,fields, function(err, data) {
      if(err) {
        return cb(err);
      }
      return cb(null, data);
    }
  );
}

function find(filter,fields, cb) {
  User.find(filter,fields, function(err, data) {
      if(err) {
        return cb(err);
      }
      return cb(null, data);
    }
  );
}

function createFacebookUser(fbUser, cb) {
  var newFbUser = {
    firstName: fbUser.first_name,
    lastName: fbUser.last_name,
    email: fbUser.email,
    facebook: {
      id: fbUser.id,
      email: fbUser.email
    },
    verify:{
      status:"verified",
      updatedAt: new Date()
    }
  };
  this.create(newFbUser, function (err, data) {
    if(err) return cb(err);
    //authEmailService.sendWelcomeEmail(data, function(err, dataemail) {
      //if(err) return cb(err);
      return cb(null, data);
    //});
  });
}
function mergeFacebookUser(dataUser ,cb) {
  dataUser.user.facebook = {
    id: dataUser.fbUser.id,
    email: dataUser.fbUser.email
  };
  this.save(dataUser.user, function (err, data) {
    if(err) return cb(err);
    return cb(null, data);
  });
}

function validateBirthDateSync(birthDate) {
  var isFuture = moment(moment(birthDate)).isAfter(new Date());
  if(moment(birthDate).format() === 'Invalid date'  || isFuture){//validate date
    /*return res.json(400, {
      "code": "ValidationError",
      "message": "Invalid date",
    });*/
    return false;
  }
  return true;
}

function validateHeightSync(height) {
  if(typeof height != 'number' || height < 0){
  /*return res.json(400, {
    "code": "ValidationError",
    "message": "Height value is not accepted"
  });*/
  return false;
  }
  return true;
}

function validateWeightSync(weight) {
  if(typeof weight != 'number' || weight < 0){
  /*return res.json(400, {
    "code": "ValidationError",
    "message": "Weight value is not accepted"
  });*/
  return false;
  }
  return true;
}
var regExp = /^[a-zA-Z\s]*$/;
function validateFirstNameSync(firstName) {
  if(!regExp.test(firstName) || firstName === '' || firstName === undefined || firstName === null || firstName.length > 128 ){
    return false;
  }
  return true;
}

function validateOnlyLetterSync(word) {
  if(!regExp.test(word) || word === '' || word === undefined || word === null){
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

function validateGenderSync(gender) {
  if(gender != 'male' && gender != 'female'){
    /*return res.json(400, {
      "code": "ValidationError",
      "message": "Gender are not accepted"
    });*/
    return false;
  }
  return true;
}

function isChild(sourceUserId, targetUserId) {//Relation.
  if(sourceUserId === targetUserId){
    return true;
  }
  return false;
}

exports.save = save;
exports.create = create;
exports.findOne = findOne;
exports.findOneFilter = findOneFilter;
exports.find = find;
exports.update = update;
exports.updateFilter = updateFilter;
exports.createFacebookUser = createFacebookUser;
exports.mergeFacebookUser = mergeFacebookUser;

exports.validateBirthDateSync = validateBirthDateSync;
exports.validateHeightSync = validateHeightSync;
exports.validateWeightSync = validateWeightSync;
exports.validateFirstNameSync = validateFirstNameSync;
exports.validateLastNameSync = validateLastNameSync;
exports.validateGenderSync = validateGenderSync;
exports.validateOnlyLetterSync = validateOnlyLetterSync;
exports.isChild = isChild;
