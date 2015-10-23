'use strict';

var app = require('../../app');
var request = require('supertest');
var assert = require('chai').assert;
var paymentEmailService = require("./payment.email.service");

var user = [{email:'convenieceselect@gmail.com', firstName:'uni test payment email service'}];
var orderId = '000000000';
var email = 'convenieceselect@gmail.com';
var paymentMethod = 'paymentMethod';
var last4Digits = '1234';
var amount = '1200';
var item = {name:'00U CS',sku:'sku'};
var schedules = [{'nextPaymentDue':new Date(), price: 1200}];
var period = 'period';
var card = {data:[{last4:'0000'}]};
var description = 'description';
var account = {
    bankAccounts:[{accountNumber:'accountNumber'}]
};

describe('payment.email.service', function() {
    it.skip('sendNewOrderEmail', function (done) {
        this.timeout(15000);
        paymentEmailService.sendNewOrderEmail(orderId, email, paymentMethod, last4Digits, amount, schedules, item, description, function(err, data){
            assert.equal(err, null);
            assert(data);
            assert(data.accepted);
            done();
        });
    });

    it.skip('sendEmailReminderPyamentParents', function (done) {
        this.timeout(15000);
        paymentEmailService.sendEmailReminderPyamentParents(user, item.name, schedules[0], amount, period, card, function(err, data){
            assert(data);
            assert(data.accepted);
            done();
        });
    });

    it.skip('sendFinalEmail', function (done) {
        this.timeout(15000);
        paymentEmailService.sendFinalEmail(user[0], amount, orderId, account, function(err, data){
            assert(data);
            assert(data.accepted);
            done();
        });
    });

    it('sendProcessedEmail', function (done) {
        this.timeout(15000);
        paymentEmailService.sendProcessedEmail(user[0], amount, orderId, account, function(err, data){
            assert(data);
            assert(data.accepted);
            done();
        });
    });

});
