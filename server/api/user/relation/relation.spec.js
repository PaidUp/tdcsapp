'use strict';

var should = require('should');
var app = require('../../../app');
var request = require('supertest');
var assert = require('chai').assert;

var Relation = require('./relation.model');
var relationController = require('./relation.controller');
var User = require('../user.model');

describe('relation.controller', function(){
	it('/create', function(done) {
    request(app)
		.post('/api/v1/user/relation/create?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NDg3MjNlOTQ0NGRiM2E4MDVkMjJjMmEiLCJpYXQiOjE0MTgyMjYwODU5MTEsImV4cCI6MzMxMDM4NjA4NTkxMX0.TmtnoanE1sFwWHHbfh1f0JqfpfWgfEz5TmcWPLcCCQI')
		.send({sourceUserId:'xxx', targetUserId:'yyy',type:'child'})
		.expect(200)
		.expect('Content-Type', 'text/plain; charset=utf-8')
		.end(function(err, res) {
		if (err) return done(err);
		done();
		});
  	});
/*
  	it('/list', function(done) {
    request(app)
		.post('/api/v1/user/relation/list?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NDg3MjNlOTQ0NGRiM2E4MDVkMjJjMmEiLCJpYXQiOjE0MTgyMjYwODU5MTEsImV4cCI6MzMxMDM4NjA4NTkxMX0.TmtnoanE1sFwWHHbfh1f0JqfpfWgfEz5TmcWPLcCCQI')
		.send({sourceUserId:'xxx', targetUserId:'yyy',type:'child'})
		.expect(200)
		.expect('Content-Type', 'text/plain; charset=utf-8')
		.end(function(err, res) {
		if (err) return done(err);
		done();
		});
  	});
*/
});
/*
describe('relation.service', function(){
	it('save', function (done) {
    var user = new User({
      firstName: 'jesse',
      lastName: 'cogollo',
    });
    userService.save(user, function(err, data){
      assert.equal(err, null);
      assert(data._id);
      done();
    });
  });
});
*/
