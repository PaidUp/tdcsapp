'use strict';

var User = require('../user.model.js');
var Address = require('./address.model');

function validateTypeAddressSync(contact) {
  if(contact != 'shipping' && contact != 'billing' && contact != 'other' && contact != 'loan'){
    return false;
  }
  return true;
}

exports.validateTypeAddressSync = validateTypeAddressSync;