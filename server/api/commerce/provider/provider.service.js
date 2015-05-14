'use strict';

var mongoose = require('mongoose');
var Provider = require('./provider.model.js');
var Blind = require('blind');
//var isValidSSN = require('is-valid-ssn');
var config = require('../../../config/environment/index');

function save(provider, cb) {
  //console.log('Provider service',Provider);
  provider.save(function(err, data) {
    if(err) {
      return cb(err);
    }
    return cb(null, data);
  });
}

function create(provider, cb) {
  Provider.create(user, function(err, data) {
      if(err) {
        return cb(err);
      }
      return cb(null, data);
    }
  );
}

function findOne(filter, fields, cb) {
  Provider.findOne(filter, fields, function(err, data) {
      if(err) {
        return cb(err);
      }
      return cb(null, data);
    }
  );
}

function findById(id, cb) {
  Provider.findById(id, function (err, provider) {
      if(err) {
        return cb(err);
      }
      return cb(null, provider);
    }
  );
}

function find(filter,fields, cb) {
  Provider.find(filter,fields, function(err, data) {
      if(err) {
        return cb(err);
      }
      return cb(null, data);
    }
  );
}

function update(filter, value, cb) {
  Provider.update(filter, value, function(err, data) {
    if(err) {
      return cb(err);
    }
    return cb(null, data);
  });
}

var encryptKey = config.encryptKey;
function encryptSSN(ssn){
  var encrypted = new Blind({ encryptKey: encryptKey }).encrypt(ssn);
  return encrypted;
}

function decryptSSN(encryptedSSN){
  var decrypted = new Blind({ encryptKey: encryptKey }).decrypt(encryptedSSN);
  return decrypted;
}

/*function verifySSN(ssn) {
  return isValidSSN(ssn);
}*/

function getlast4ssn(encryptedSSN){
  var last4snn = decryptSSN(encryptedSSN);
  return last4snn.substring(last4snn.length - 4, last4snn.length);
}

exports.save = save;
exports.create = create;
exports.findOne = findOne;
exports.findById = findById;
exports.find = find;
exports.update = update;
exports.encryptSSN = encryptSSN;
exports.decryptSSN = decryptSSN;
//exports.verifySSN = verifySSN;
exports.getlast4ssn = getlast4ssn;
