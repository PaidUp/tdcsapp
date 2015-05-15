'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var config = require('../../../config/environment/index.js');

var ProviderSchema = new Schema({
    //Team info
    teamName: { type: String, required: true},
    teamNumber: { type: String, required: true},
    teamAverageSize: { type: String },
    teamSport:{type: String, required: true},
    //End team info
    
    //Owner info
    ownerId: { type: String, required: true},
    ownerName: { type: String, required: true},
    ownerDOB: { type: Date},
    ownerSSN: { type: String, required: true},
    ownerEmail: { type: String, required: true},
    ownerPhone: { type: String, required: true},
    //End owner info
    
    //Billing info
    country: { type: String, required: true},
    state: { type: String, required: true},
    city: { type: String, required: true},
    averagePayment: { type: String, required: true},
    EIN: { type: String, required: true},
    Address: { type: String, required: true},
    website: { type: String, required: true},
    businessName: { type: String, required: true},
    phoneNumber: { type: String, required: true},
    //End billing info
    
    //Billing info
    aba: { type: String, required: true},
    dda: { type: String, required: true},
    //End billing info

    createAt: {type: Date, default: new Date()},
    updateAt: {type: Date, default: new Date()},
    
    verify: {type: String,default:'pending'}
});

/**
 * Pre-save hook
 */
 ProviderSchema
  .pre('save', function(next) {
    if (!this.isNew) return next();
    this.update_at = new Date();
    next();
  });


module.exports = mongoose.model('Provider', ProviderSchema, config.mongo.options.prefix + 'providers');
