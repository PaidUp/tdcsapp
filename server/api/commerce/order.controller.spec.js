'use strict';

var app = require('../../app');
var request = require('supertest');
var assert = require('chai').assert;
var authService = require('../auth/auth.service');

describe('order', function() {
  this.timeout(11000);
  Error.stackTraceLimit = Infinity;

  var userId = "54b68ef15184f513e3a888e9";
  var token = authService.signToken(userId);

  it('list orders', function(done) {
    request(app)
      .get('/api/v1/commerce/order/list')
      .set('Authorization', "Bearer "+token)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        console.log(res.body);
        done();
      });
  });
});
