'use strict';

var should = require('should');
var app = require('../../../app');
var request = require('supertest');
var assert = require('chai').assert;

var Address = require('./address.model');
var addressController = require('./address.controller');
var User = require('../user.model');