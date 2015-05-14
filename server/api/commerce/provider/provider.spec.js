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

    describe('provider.service', function() {
    
        it.only('save', function (done) {
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
});
