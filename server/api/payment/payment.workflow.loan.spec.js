'use strict';

var should = require('should');
var app = require('../../app');
var assert = require('chai').assert;
var config = require('../../config/environment');
var request = require('supertest');
var paymentService = require('./payment.service');
var balanced = require('balanced-official');
var authService = require('../auth/auth.service');
var userService = require('../user/user.service');
var modelSpecPayment = require('./payment.model.spec');

describe('payment workflow loan', function (){
  describe('Prepare user', function (){
    it('Create fake user', function(done){
      var userFake = {firstName:modelSpecPayment.firstName,lastName:modelSpecPayment.lastName};
      request(app)
        .post('/api/v1/user/create')
        .expect(200)
        .send(userFake)
        .end(function(err, res) {
          if (err) return done(err);
          assert(res.body.userId);
          modelSpecPayment.userId = res.body.userId;
          done();
        });
    });

    it('add credentials to fake user', function(done){
      var credentialFake = {userId: modelSpecPayment.userId,email: modelSpecPayment.email,password: modelSpecPayment.password,rememberMe: true};
      request(app)
        .post('/api/v1/auth/local/signup')
        .send(credentialFake)
        .expect(200)
        .expect('Content-Type', 'application/json')
        .end(function(err, res) {
          if (err) return done(err);
          assert(res.body.token);
          modelSpecPayment.token = res.body.token;
          done();
        });
    });

    it('Create fake child to userFake', function(done){
      var userFake = {token:modelSpecPayment.token,firstName:modelSpecPayment.firstName,lastName:modelSpecPayment.lastName, gender:modelSpecPayment.gender};
      request(app)
        .post('/api/v1/user/create')
        .set('Authorization', "Bearer "+modelSpecPayment.token)
        .expect(200)
        .send(userFake)
        .end(function(err, res) {
          if (err) return done(err);
          assert(res.body.userId);
          modelSpecPayment.athleteId = res.body.userId;
          done();
        });
    });

    it('Create relationFake', function(done){
      var relationFake = {token:modelSpecPayment.token,sourceUserId:modelSpecPayment.userId,targetUserId:modelSpecPayment.athleteId, type:modelSpecPayment.typeRelation};
      request(app)
        .post('/api/v1/user/relation/create')
        .set('Authorization', "Bearer "+modelSpecPayment.token)
        .expect(200)
        .send(relationFake)
        .end(function(err, res) {
          if (err) return done(err);
          assert(res.body);
          done();
        });
    });
  });

  describe('workflow loan', function() {
    this.timeout(60000);
    it('getChild', function(done) {
      request(app)
        .get('/api/v1/user/relation/list')
        .set('Authorization', "Bearer "+modelSpecPayment.token)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          assert.operator(0, '<', res.body.length);
          modelSpecPayment.athleteId = res.body[0].targetUserId;
          done();
        });
    });

    it('createCart', function(done) {
      request(app)
        .get('/api/v1/commerce/cart/create')
        .set('Authorization', "Bearer "+modelSpecPayment.token)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          assert.isNotNull(res.body.cartId);
          modelSpecPayment.cartId = res.body.cartId;
          done();
        });
    });

    it('viewCart', function(done) {
      request(app)
        .get('/api/v1/commerce/cart/view/'+modelSpecPayment.cartId)
        .set('Authorization', "Bearer "+modelSpecPayment.token)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.grandTotal, 0);
          done();
        });
    });

    it('addToCart', function(done) {
      var data = {cartId:modelSpecPayment.cartId,products:modelSpecPayment.products};
      request(app)
        .post('/api/v1/commerce/cart/add')
        .set('Authorization', "Bearer "+modelSpecPayment.token)
        .expect(200)
        .send(data)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(true, res.body);
          done();
        });
    });

    it('getTotals', function(done) {
      request(app)
        .get('/api/v1/commerce/cart/totals/'+modelSpecPayment.cartId)
        .set('Authorization', "Bearer "+modelSpecPayment.token)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          assert.isNotNull(res.body);
          assert.isNotNull(res.body[0]);
          assert.equal(1674.99, res.body[0].amount);
          done();
        });
    });

    // Loan
    it('createLoanUser', function(done) {
      request(app)
        .post('/api/v1/loan/application/user/create')
        .set('Authorization', "Bearer "+modelSpecPayment.token)
        .expect(200)
        .send(modelSpecPayment.loanData())
        .end(function(err, res) {
          if (err) return done(err);
          assert.isNotNull(res.body.userId);
          modelSpecPayment.loanUserId = res.body.userId;
          done();
        });
    });

    it('createLoanUserContact1', function(done) {
      var data = {
        userId:modelSpecPayment.loanUserId,
        label:"email",
        type:"email",
        value:modelSpecPayment.email
      };
      request(app)
        .post('/api/v1/loan/application/user/contact/create')
        .set('Authorization', "Bearer "+modelSpecPayment.token)
        .expect(200)
        .send(data)
        .end(function(err, res) {
          if (err) return done(err);
          assert.isNotNull(res.body.contactId);
          done();
        });
    });

    it('createLoanUserContact2', function(done) {
      var data = {
        userId:modelSpecPayment.loanUserId,
        label:"telephone",
        type:"telephone",
        value:"123456789"
      };
      request(app)
        .post('/api/v1/loan/application/user/contact/create')
        .set('Authorization', "Bearer "+modelSpecPayment.token)
        .expect(200)
        .send(data)
        .end(function(err, res) {
          if (err) return done(err);
          assert.isNotNull(res.body.contactId);
          done();
        });
    });

    it('createLoanUserAddress1', function(done) {
      var data = {
        userId:modelSpecPayment.loanUserId,
        address1:"Av. Chavez",
        state:"TX",
        city:"Austin",
        zipCode:"77818",
        country:"USA",
        type:"loan",
        label:"loan"
      };
      request(app)
        .post('/api/v1/loan/application/user/address/create')
        .set('Authorization', "Bearer "+modelSpecPayment.token)
        .expect(200)
        .send(data)
        .end(function(err, res) {
          if (err) return done(err);
          assert.isNotNull(res.body.addressId);
          done();
        });
    });

    it('createLoanApplication', function(done) {
      var data = {
        incomeType:"Employed (Military)",
        monthlyGrossIncome:"123456",
        amount:1650,
        numberPayments:6,
        meta:{userId:modelSpecPayment.loanUserId}
      };
      request(app)
        .post('/api/v1/loan/application/create')
        .set('Authorization', "Bearer "+modelSpecPayment.token)
        .expect(200)
        .send(data)
        .end(function(err, res) {
          if (err) return done(err);
          assert.isNotNull(res.body.applicationId);
          modelSpecPayment.applicationId = res.body.applicationId;
          done();
        });
    });

    it('signLoanApplication', function(done) {
      var data = {
        firstName:modelSpecPayment.firstName,
        lastName:modelSpecPayment.lastName,
        ssn:"6789",
        applicationId:modelSpecPayment.applicationId
      };
      request(app)
        .post('/api/v1/loan/application/sign')
        .set('Authorization', "Bearer "+modelSpecPayment.token)
        .expect(200)
        .send(data)
        .end(function(err, res) {
          if (err) return done(err);
          assert.isNotNull(res.body.loanId);
          modelSpecPayment.loanId = res.body.loanId;
          done();
        });
    });

    it('placeCart', function(done) {
      this.timeout(20000);

      // Place Order
      var data = {
        cartId:modelSpecPayment.cartId,
        loanId:modelSpecPayment.loanId,
        addresses:[
          {"mode":"billing","firstName":"Ignacio","lastName":"Pascual","address1":"my address my address2","city":"Austin","state":"TX","zipCode":11111,"country":"US","telephone":"1234444555"},
          {"mode":"shipping","firstName":"Ignacio","lastName":"Pascual","address1":"my address my address2","city":"Austin","state":"TX","zipCode":11111,"country":"US","telephone":"1234444555"}],
        userId: modelSpecPayment.athleteId,
        paymentMethod: "directdebit",
        payment: "loan"
      };
      request(app)
        .post('/api/v1/commerce/checkout/place')
        .set('Authorization', "Bearer "+modelSpecPayment.token)
        .expect(200)
        .send(data)
        .end(function(err, res) {
          if (err) return done(err);
          done();
        });
    });

    // POST
    // /api/v1/payment/bank/create
    // {"bankId":"BA1VkCIw2WmtLQR3ZY1Rc0Kc"}

    // POST
    // /api/v1/payment/bank/verify
    //{"deposit1":"1","deposit2":"1","verificationId":"BZ23iPtxnOAc0MdlmOfOwb9H"}
  });
});
