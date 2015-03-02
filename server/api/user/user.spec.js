'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');
var assert = require('chai').assert;
var User = require("../../api/user/user.model");
var userService = require("../../api/user/user.service");
var logger = require('../../config/logger');
//logger.info(err, err);
var userId = '';
var userTest = {
  firstName : 'cs firstName',
  lastName : 'cs lastName'
};

var userTestBad = {
  firstName : 'cs firstName 2',
  lastName : 'cs lastName 3'
};

describe('user.controller', function() {
  it.only('/create firstName, lastName', function(done) {
    request(app)
      .post('/api/v1/user/create')
      .send(userTest)
      .expect(200)
      //.expect('Content-Type', 'application/json')
      .end(function(err, res) {
        if (err) return done(err);
        //userTest.id = res.body.userId;
        assert(res.body.userId);
        done();
      });
  });

  it('/create fail without firstName', function(done) {
    request(app)
      .post('/api/v1/user/create')
      .send({lastName:userTest.lastName})
      .expect(400)
      .expect('Content-Type', 'application/json')
      .end(function(err, res) {
        if (err) return done(err);
        assert.equal(res.body.message, 'First name is not accepted');
        done();
      });
  });

  it('/create fail without lastName', function(done) {
    request(app)
      .post('/api/v1/user/create')
      .send({firstName:userTest.firstName})
      .expect(400)
      .expect('Content-Type', 'application/json')
      .end(function(err, res) {
        if (err) return done(err);
        assert.equal(res.body.message, 'Last name is not accepted');
        done();
      });
  });

  it('/create fail firstName with number', function(done) {
    request(app)
      .post('/api/v1/user/create')
      .send(userTestBad)
      .expect(400)
      .expect('Content-Type', 'application/json')
      .end(function(err, res) {
        if (err) return done(err);
        assert.equal(res.body.message, 'First name is not accepted');
        done();
      });
  });

  it('/create athlete fail birthDate is future', function(done) {
    request(app)
      .post('/api/v1/user/create')
      .send({firstName:'jesse',lastName:'cogollo',birthDate:'2015-07-29'})
      .expect(400)
      .expect('Content-Type', 'application/json')
      .end(function(err, res) {
        if (err) return done(err);
        assert.equal(res.body.message, 'Birthdate is not accepted');
        done();
      });
  });

  it('/create fail birthDate is invalid', function(done) {
    request(app)
      .post('/api/v1/user/create')
      .send({firstName:'jesse',lastName:'cogollo',birthDate:'1987-15-29'})
      .expect(400)
      .expect('Content-Type', 'application/json')
      .end(function(err, res) {
        if (err) return done(err);
        assert.equal(res.body.message, 'Birthdate is not accepted');
        done();
      });
  });
/*
  it('/current', function(done) {
    request(app)
      .get('/api/v1/user/current?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NDg3MjNlOTQ0NGRiM2E4MDVkMjJjMmEiLCJpYXQiOjE0MTgyMjYwODU5MTEsImV4cCI6MzMxMDM4NjA4NTkxMX0.TmtnoanE1sFwWHHbfh1f0JqfpfWgfEz5TmcWPLcCCQI')
      .expect(200)
      .end(function(err, res) {
        assert(res.body._id);
        done();
      });
  });
*/
  it('/current invalid token', function(done) {
    request(app)
      .get('/api/v1/user/current?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NDg3MjNlOTQ0NGRiM2E4MDVkMjJjMmEiLCJpYXQiOjE0MTgyMjYwODU5MTEsImV4cCI6MzMxMDM4NjA4NTkxMX0.TmtnoanE1sFwWHHbfh1f0JqfpfWgfEz5TmcWPLcCCQI')
      .expect(401)
      .end(function(err, res) {
        done();
      });
  });
/*
  it('/'+userId, function(done) {
    request(app)
      .get('/api/v1/user/'+userId+'?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NDg3MjNlOTQ0NGRiM2E4MDVkMjJjMmEiLCJpYXQiOjE0MTgyMjYwODU5MTEsImV4cCI6MzMxMDM4NjA4NTkxMX0.TmtnoanE1sFwWHHbfh1f0JqfpfWgfEz5TmcWPLcCCQI')
      .expect(403)
      .end(function(err, res) {
        assert.equal(res.body.message, 'You don\'t have permission for this operation');
        done();
      });
  });
*/
});

describe('user.model', function() {

  it('addRole', function (done) {
    var user = new User();
    user.addRole("user");
    assert.equal(user.roles.length, 1);
    done();
  });

  it('hasRole', function (done)  {
    var user = new User();
    user.addRole("user");
    user.addRole("team_owner");
    user.addRole("user");
    user.addRole("user");
    user.addRole("user");
    assert.equal(user.roles.length, 2);
    done();
  });

  it('it verifies if role exists', function (done) {
    var user = new User();
    user.addRole("user");
    user.addRole("team_owner");
    assert.equal(user.hasRole("user"), true);
    assert.equal(user.hasRole("team_owner"), true);
    assert.equal(user.hasRole("admin"), false);
    done();
  });

  it('encryptPassword', function (done) {
    var user = new User({
      firstName: 'jesse',
      lastName: 'cogollo',
      hashedPassword: 'alejandra'
    });
    var pwdEnc = user.encryptPassword(user.hashedPassword);
    assert.notEqual(pwdEnc, user.hashedPassword);
    done();
  });

  it('getFullName', function (done) {
    var user = new User({
      firstName: 'jesse',
      lastName: 'cogollo'
    });
    assert.equal(user.getFullName(), 'jesse cogollo');
    done();
  });
});

describe('user.service', function() {

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

  it('create', function (done) {
    var user = new User({
      firstName: 'jesse create',
      lastName: 'cogollo create',
    });
    userService.create(user, function(err, data){
      assert.equal(err, null);
      assert(data._id);
      done();
    });
  });

  it('findOne', function (done) {
    var filter = {};
    userService.findOne(filter, function(err, data){
      assert.equal(err, null);
      assert(data);
      done();
    });
  });
  /*
  it('update', function (done) {
    var user = new User({
      firstName: 'jesse create',
      lastName: 'cogollo create',
    });
    userService.create(user, function(err, dataSave){
      userService.update(dataSave, function(err, dataUpd){
        //assert.equal(dataUpd, 'javierr');
        done();
      });
      //assert.equal(err, null);
      //assert(dataSave._id);
      //done();
    });
  });
  */
  it('find', function (done) {
    var filter = {};
    var fields = '-firstName';
    userService.find(filter,fields, function(err, data){
      assert.equal(err, null);
      assert(!data[0].firstName);
      done();
    });
  });
  /*
    it('createFacebookUser', function (done) {
    this.timeout(5000);
    var fbUser = {
      first_name:'fbFirstName',
      last_name:'fbLastName',
      id:'fakeId',
      email:'email@fb.com'
    };
    userService.createFacebookUser(fbUser, function(err, data){
      assert.equal(err, null);
      assert(data);
      done();
    });
  });
  */
  it('mergeFacebookUser', function (done) {
    var user = new User({
      firstName: 'jesse',
      lastName: 'cogollo',
    });

    var fbUser = {
      first_name:'fake fbFirstName',
      last_name:'fake fbLastName',
      id:'fakeId',
      email:'jesse.cogollo@talosdigital.com'
    };
    
    userService.mergeFacebookUser({user:user,fbUser:fbUser}, function(err, data){
      assert.equal(err, null);
      assert(data);
      done();
    });
  });

  it('validateBirthDate Ok', function(done){
    var birthDate = '1987-07-29';
    var validation = userService.validateBirthDateSync(birthDate);
    assert(validation);
    done();
  });

  it('validateBirthDate fail', function(done){
    var birthDate = '1987-17-29';
    var validation = userService.validateBirthDateSync(birthDate);
    assert(!validation);
    done();
  });

  it('validateBirthDate future', function(done){
    var birthDate = '2015-07-29';
    var validation = userService.validateBirthDateSync(birthDate);
    assert(!validation);
    done();
  });

  it('validateHeightSync Ok', function(done){
    var height = 90;
    var validation = userService.validateHeightSync(height);
    assert(validation);
    done();
  });

  it('validateHeightSync fail', function(done){
    var height = -90;
    var validation = userService.validateHeightSync(height);
    assert(!validation);
    done();
  });

  it('validateWeightSync Ok', function(done){
    var weight = 180;
    var validation = userService.validateWeightSync(weight);
    assert(validation);
    done();
  });

  it('validateWeightSync fail', function(done){
    var weight = -180;
    var validation = userService.validateWeightSync(weight);
    assert(!validation);
    done();
  });

  it('validateFirstNameSync Ok', function(done){
    var firstName = 'jesse';
    var validation = userService.validateFirstNameSync(firstName);
    assert(validation);
    done();
  });

  it('validateFirstNameSync fail', function(done){
    var firstName = 'jesse 2';
    var validation = userService.validateFirstNameSync(firstName);
    assert(!validation);
    done();
  });

  it('validateFirstNameSync fail, more then 128 alfa characters.', function(done){
    var firstName = 'jesse the alfa characters more the alfa characters more the alfa characters more the alfa characters more the alfa characters wer';
    var validation = userService.validateFirstNameSync(firstName);
    assert(!validation);
    done();
  });

  it('validateOnlyLetterSync Ok', function(done){
    var word = 'jesse';
    var validation = userService.validateOnlyLetterSync(word);
    assert(validation);
    done();
  });

  it('validateOnlyLetterSync fail', function(done){
    var word = 'jesse 1987';
    var validation = userService.validateOnlyLetterSync(word);
    assert(!validation);
    done();
  });

  it('validateLastNameSync Ok', function(done){
    var lastName = 'cogollo';
    var validation = userService.validateLastNameSync(lastName);
    assert(validation);
    done();
  });

  it('validateLastNameSync fail', function(done){
    var lastName = 'cogollo 2';
    var validation = userService.validateLastNameSync(lastName);
    assert(!validation);
    done();
  });

  it('validateLastNameSync fail, more then 128 alfa characters.', function(done){
    var lastName = 'cogollo the alfa characters more the alfa characters more the alfa characters more the alfa characters more the alfa characters wer';
    var validation = userService.validateLastNameSync(lastName);
    assert(!validation);
    done();
  });

  it('validateGenderSync Ok male', function(done){
    var gender = 'male';
    var validation = userService.validateGenderSync(gender);
    assert(validation);
    done();
  });

  it('validateGenderSync Ok female', function(done){
    var gender = 'female';
    var validation = userService.validateGenderSync(gender);
    assert(validation);
    done();
  });

  it('validateGenderSync fail masculino', function(done){
    var gender = 'masculino';
    var validation = userService.validateGenderSync(gender);
    assert(!validation);
    done();
  });

});
