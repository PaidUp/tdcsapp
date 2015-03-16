'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var loanContactsSchema = new Schema({
  label: String,
  type: String,
  value: String,
  createAt: {type: Date, default: new Date()},
  updateAt: {type: Date, default: new Date()}
});

module.exports = mongoose.model('loanContact', loanContactsSchema);