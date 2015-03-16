'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');
var assert = require('chai').assert;
var config = require('../../config/environment');
var commerceService = require('./commerce.service');
var logger = require('../../config/logger');
var userService = require('../user/user.service');

var userId = '54b68ef15184f513e3a888e9';
describe('payment.adapter', function() {
  this.timeout(10000);
  it("get user orders", function(done) {
    userService.findOne({_id: userId}, function (err, user) {
      if (err) return done(err);
      commerceService.getUserOrders(user, function (err, orders) {
        if (err) return done(err);
        console.log(JSON.stringify(orders));
        assert.equal(orders.length, 2);
        orders.forEach(function (order) {
          assert.equal(true, order.grandTotal != 0);
          assert.equal(true, order.athleteId != '');
          assert.equal(true, order.payment != '');
          assert.equal(true, order.productId != '');
          assert.equal(true, order.status != '');
          assert.equal(true, order.createdAt != '');
        });
        done();
      });
    });
  });
});
