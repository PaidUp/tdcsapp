'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var loanAddressesSchema = new Schema({
  type: String,
  label: String,
  address1: String,
  address2: String,
  city: String,
  state: String,
  country: String,
  zipCode: String,
  createAt: {type: Date, default: new Date()},
  updateAt: {type: Date, default: new Date()}
});

module.exports = mongoose.model('loanAddress', loanAddressesSchema);