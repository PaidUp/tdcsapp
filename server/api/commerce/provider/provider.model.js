'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var config = require('../../../config/environment/index.js');

var ProviderSchema = new Schema({
    //Team info
    teamName: { type: String, required: true},
    teamNumber: { type: String},
    teamAverageSize: { type: String },
    teamSport:{type: String},
    //End team info
    
    //Owner info
    ownerId: { type: String},
    ownerName: { type: String, required: true},//required
    ownerDOB: { type: Date},//required
    ownerSSN: { type: String, required: true},//required
    ownerEmail: { type: String},
    ownerPhone: { type: String},
    //End owner info
    
    //Billing info
    country: { type: String, default: 'US'},//required
    state: { type: String, required: true},//required
    city: { type: String, required: true},//required
    zipCode: { type: String, required: true},//required
    averagePayment: { type: String},
    EIN: { type: String, required: true},//required
    Address: { type: String, required: true},//required
    website: { type: String},
    businessName: { type: String, required: true},//required
    phoneNumber: { type: String},
    businessType: { type: String, required: true},//required
    //End billing info
    
    //Billing info
    aba: { type: String, required: true},//required
    dda: { type: String, required: true},//required
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
