'use strict';

// var app = require('../../app');
// var request = require('supertest');
var assert = require('chai').assert;
var duesService = require("./dues.service")();

describe('schedule.service', function() {
  let result = {}

  it('dues generate', function (done) {
    let params = {}
    duesService.generateDues(data,function(err, data){

      done();
    });
  });

});
