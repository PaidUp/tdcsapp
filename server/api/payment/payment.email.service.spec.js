'use strict';

var app = require('../../app');
var request = require('supertest');
var assert = require('chai').assert;
var notificationsService = require("./payment.email.service");

var userId = '000000000';
var orderId = '000000000';
var email = 'convenieceselect@gmail.com';
var paymentMethod = 'paymentMethod';
var last4Digits = '1234';
var amount = '1200';
var item = {name:'00U CS',sku:'sku'};
var schedules = [{'nextPaymentDue':new Date(), price: 1200}];
var period = 'period';

describe('payment.email.service', function() {
    it.skip('sendNewOrderEmail', function (done) {
        this.timeout(15000);
        notificationsService.sendNewOrderEmail(orderId, email, paymentMethod, last4Digits, amount, schedules, item, function(err, data){
            assert.equal(err, null);
            assert(data);
            assert(data.accepted);
            done();
        });
    });

    it('sendEmailReminderPyamentParents with bad user', function (done) {
        this.timeout(15000);
        notificationsService.sendEmailReminderPyamentParents(userId, item.name, schedules[0], amount, period, function(err, data){
            console.log('err',err);
            console.log('data',data);
            assert.equal(err.code, 'ValidationError');
            assert.equal(err.message, 'filter incorrect.');
            //assert(data);
            //assert(data.accepted);
            done();
        });
    });

    it('sendEmailReminderPyamentParents', function (done) {
        this.timeout(15000);
        userId = 'TODO  save user or mock methods';
        notificationsService.sendEmailReminderPyamentParents(userId, item.name, schedules[0], amount, period, function(err, data){
            console.log('err',err);
            console.log('data',data);
            assert.equal(err.code, 'ValidationError');
            assert.equal(err.message, 'filter incorrect.');
            //assert(data);
            //assert(data.accepted);
            done();
        });
    });

});
