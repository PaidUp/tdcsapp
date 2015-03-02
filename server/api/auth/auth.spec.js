'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');
var assert = require('chai').assert;
var authEmailService = require('./auth.email.service');
var User = require('../user/user.model');
var authService = require('./auth.service');
var uuid = require('node-uuid');
var authController = require('./auth.controller');
var logger = require('../../config/logger');
var user;
var token;

before('auth before', function(){
  it('signup user', function(done){
    user = new User({
      firstName : 'auth',
      lastName : 'spec'
    });
    user.save();
    done();
  });

  it('/signup', function(done) {
    request(app)
      .post('/api/v1/auth/local/signup')
      .send({
        "userId": user.id,
        "email": "jesse.cogollo@talosdigital.com",
        "password": "Qwerty1!",
        "rememberMe": false
      })
      .expect(200)
      .expect('Content-Type', 'application/json')
      .end(function(err, res) {
        if (err) return done(err);
        token = res.body.token;
        done();
      });
  });
});

//after('auth after', function(done){
  //user.remove();
  //done();
//});

describe('auth.email.service', function() {

  it('sendWelcomeEmail', function (done) {
    this.timeout(5000);
    authEmailService.sendWelcomeEmail(user, function (err, data) {
      if (err) {
        logger.info(err, err);
      }
      assert(!err);
      done();
    });
  });

  it('sendWelcomeTokenEmail', function (done) {
    this.timeout(5000);
    authEmailService.sendWelcomeTokenEmail(user, token, function (err, data) {
      if (err) {
        logger.info(err, err);
      }
      assert(!err);
      done();
    });
  });

  it('sendResetTokenEmail', function (done) {
    this.timeout(5000);
    var user = new User({
      firstName: "Convenience",
      lastName: "Select",
      email: "jesse.cogollo@talosdigital.com"
    });
    var token = uuid.v4();
    authEmailService.sendResetTokenEmail(user, token, function (err, data) {
      if (err) {
        logger.info(err, err);
      }
      assert(!err);
      done();
    });
  });
});

describe('auth.service', function(){

  it('isValidEmail Ok', function(done){
    var email = 'jesse.cogollo@talosdigital.com';
    var validation = authService.isValidEmail(email);
    assert(validation);
    done();
  });

  it('isValidEmail fail', function(done){
    var email = 'jesse.cogollo@talosdigital.com.';
    var validation = authService.isValidEmail(email);
    assert(!validation);
    done();
  });

  it('verifyEmailRequest', function(done){
    this.timeout(2500);
    authService.verifyEmailRequest(user, function(err, data){
      if(err) done(err);
      assert.equal(data.verify.status, 'sent');
      done();
    });    
  });
  /*
  it('verifyEmail', function(done){
    this.timeout(5000);
    var token = 'notValid';
    authService.verifyEmail(token, function(err, data){
      if(err) done(err);
      assert.equal(data.verify.status, 'sent');
      done();
    });
  });
  */

  it('ResetPassword', function(done){
    this.timeout(2500);
    authService.ResetPassword(user, function(err, data){
      if(err) done(err);
      assert.equal(data.resetPassword.status, 'sent');
      done();
    });    
  });
/*
  it('verifyPasswordToken', function(done){
    this.timeout(3000);
    authService.verifyPasswordToken(token, function(err, data){
      assert.equal(err.name,'ValidationError');
      done();
    });
  });
*/
  it('validationPasswordSync Ok', function(done){
    var password = '!1Aqwerty';
    var validation = authService.validationPasswordSync(password);
    assert.equal(validation, '');
    done();
  });

  it('validationPasswordSync fail ', function(done){
    var password = '';
    var validation = authService.validationPasswordSync(password);
    assert.equal(validation, 'less than 8 characters No lowerCase No upperCase No digits No specialCharacter');
    done();
  });

  it('validationPasswordSync fail querty', function(done){
    var password = 'querty';
    var validation = authService.validationPasswordSync(password);
    assert.equal(validation, 'less than 8 characters No upperCase No digits No specialCharacter');
    done();
  });

  it('validationPasswordSync fail !Aq*', function(done){
    var password = '!Aq*';
    var validation = authService.validationPasswordSync(password);
    assert.equal(validation, 'less than 8 characters No digits');
    done();
  });

  it('validationPasswordSync fail Convenience123', function(done){
    var password = 'Convenience123';
    var validation = authService.validationPasswordSync(password);
    assert.equal(validation, ' No specialCharacter');
    done();
  });
});

describe('auth/local', function(){

  it('/login 401', function(done) {
    request(app)
    .post('/api/v1/auth/local/login')
    .send({
      "email": 'jesse.cogollo@talosdigital.com',
      "password": "Qwerty2!",
      "rememberMe": false
    })
    .expect(401)
    .end(function(err, res) {
      if (err) return done(err);
      assert.equal(res.body.code, 'PermissionDenied');
      done();
    });
  });
  
  it('/login 200', function(done) {
    request(app)
    .post('/api/v1/auth/local/login')
    .send({
      "email": 'jesse.cogollo@talosdigital.com',
      "password": "Qwerty1!",
      "rememberMe": false
    })
    .expect(200)
    .end(function(err, res) {
      if (err) return done(err);
      assert(res.body.token);
      done();
    });
  });

});




