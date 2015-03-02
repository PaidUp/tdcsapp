'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var loanUserSchema = new Schema({
  firstName: String,
  lastName: String,
  dob: String,
  createAt: {type: Date, default: new Date()},
  updateAt: {type: Date, default: new Date()},
  contacts:{
    type: Array
  },
  addresses:{
    type: Array
  },
  ssn: String
});

module.exports = mongoose.model('loanUser', loanUserSchema, 'loanUser');