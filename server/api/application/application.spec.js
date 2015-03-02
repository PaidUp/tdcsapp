'use strict';

var app = require('../../app');
var request = require('supertest');
var assert = require('chai').assert;
var applicationService = require("./application.service");
var cronjobService = require("./cronjob.service");
var logger = require('../../config/logger');

var dataContact = {
	email:'email@email.com',
	subject:'subject',
	content:'content'
};

describe('application.service', function() {

	it('configView', function (done) {
		applicationService.configView(function(err, data){
			assert.equal(err, null);
			assert(data);
			assert(data.marketplace);
			done();
		});
	});

	it('emailContact fail', function (done) {
		var dataContact = {};
		applicationService.emailContact(dataContact, function(err, data){
			assert.equal(err, 'data contact is missing');
			done();
		});
	});

	it('emailContact fail Email is not valid', function (done) {
		this.timeout(5000);
		var dataContact = {
			email:'email',
			subject:'subject',
			content:'content'
		};
		applicationService.emailContact(dataContact, function(err, data){
			assert.equal(err, 'Email is not valid');
			done();
		});
	});

	it('emailContact ok', function (done) {
		this.timeout(5000);
		applicationService.emailContact(dataContact, function(err, data){
			assert(data.accepted);
			done();
		});
	});
});

describe('application.controller', function() {
  	
  	it('/config', function(done) {
	    request(app)
	    .get('/api/v1/application/config')
	    .send()
	    .expect(200)
	    .expect('Content-Type', 'application/json')
	    .end(function(err, res) {
	        if (err) return done(err);
	        assert(res.body.marketplace);
	        done();
	    });
  	});

  	it('/contact', function(done) {
	    request(app)
	    .post('/api/v1/application/contact')
	    .send(dataContact)
	    .expect(200)
	    .expect('Content-Type', 'application/json')
	    .end(function(err, res) {
	        if (err) return done(err);
	        assert(res.body);
	        done();
	    });
  	});
});

describe('cronjob.service', function() {

	it('run ', function (done) {
		this.timeout(120000);
		cronjobService.run(function(err, data){
			if(err){
				logger.info(err.name);
				assert.equal(err.name, 'cronjob.pid is created');
			}else{
				assert.equal(data.length, 5, 'the five jobs are complete with issues.');	
			}
			done();
		});
	});
});