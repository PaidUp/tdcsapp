'use strict';

var app = require('../../../app');
var request = require('supertest');
var assert = require('chai').assert;
var Provider = require("./provider.model");
var providerService = require("./provider.service");
//var moment = require('moment');
var providerSpecModel = require('./provider.model.spec');
//var tokenTDUser = 'TDUserToken-CHANGE-ME!';

describe('User', function() {

    describe.only('provider.service', function() {

        it('save', function (done) {
            var provider = new Provider(providerSpecModel.provider);
            providerService.save(provider, function(err, data){
              if(err) return done(err);
                assert.equal(err, null);
                assert(data._id);
                assert.equal(data.teamName, provider.teamName);
                assert.equal(data.teamSport, provider.teamSport);
                assert.equal(data.ownerId, provider.ownerId);
                assert.equal(data.ownerFirstName, provider.ownerFirstName);
                assert.equal(data.ownerLastName, provider.ownerLastName);
                assert.equal(data.ownerEmail, provider.ownerEmail);
                assert.equal(data.ownerPhone, provider.ownerPhone);
                assert.equal(data.state, provider.state);
                assert.equal(data.city, provider.city);
                assert.equal(data.zipCode, provider.zipCode);
                assert.equal(data.Address, provider.Address);
                assert.equal(data.businessName, provider.businessName);
                assert.equal(data.businessType, provider.businessType);
                assert.equal(data.aba, provider.aba);
                assert.equal(data.dda, provider.dda);
                assert.equal(data.verify, provider.verify);
                assert.equal(data.phoneNumber, provider.phoneNumber);
                assert.equal(data.website, provider.website);
                assert.equal(data.averagePayment, provider.averagePayment);
                assert.equal(data.country, provider.country);
                assert.equal(data.teamAverageSize, provider.teamAverageSize);
                assert.equal(data.teamNumber, provider.teamNumber);
                done();
            });
        });
    /*
        it('create', function (done) {
          var user = new User({
            firstName: userSpecModel.user.firstName,
            lastName: userSpecModel.user.lastName
          });
          userService.create(user, function(err, data){
            assert.equal(err, null);
            assert(data._id);
            done();
          });
        });

        it('findOne', function (done) {
          var filter = {};
          userService.findOne(filter,'', function(err, data){
            assert.equal(err, null);
            assert(data);
            done();
          });
        });

        it('find', function (done) {
          var filter = {};
          var fields = '-firstName';
          userService.find(filter,fields, function(err, data){
            assert.equal(err, null);
            assert(!data[0].firstName);
            done();
          });
        });

        it('verifySSN' , function(done){
          assert(userService.verifySSN(userSpecModel.user.ssn), 'SSN is not valid');
          done();
        });

        it('encryptSSN' , function(done){
          var encSSN = userService.encryptSSN(userSpecModel.user.ssn);
          assert(encSSN);
          userSpecModel.encryptValue = encSSN;
          done();
        });

        it('decryptSSN' , function(done){
          var SSN = userService.decryptSSN(userSpecModel.encryptValue);
          assert.equal(userSpecModel.user.ssn, SSN);
          done();
        });
    */
    });

    describe.skip('provider.controller', function() {

        it('response', function (done) {
            var provider = new Provider(providerSpecModel.provider);
            providerService.save(provider, function(err, data){
                assert.equal(err, null);
                assert(data._id);
                done();
            });
        });
    /*
        it('create', function (done) {
          var user = new User({
            firstName: userSpecModel.user.firstName,
            lastName: userSpecModel.user.lastName
          });
          userService.create(user, function(err, data){
            assert.equal(err, null);
            assert(data._id);
            done();
          });
        });
    */
    });
});
