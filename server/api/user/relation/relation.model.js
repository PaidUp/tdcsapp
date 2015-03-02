'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var RelationsSchema = new Schema({
  sourceUserId: String,
  targetUserId: String,
  type: String
});

module.exports = mongoose.model('Relation', RelationsSchema);