'use strict';

var app = require('../../app');
var request = require('supertest');
var assert = require('chai').assert;
var notificationsService = require("./notifications.service");

var fakeParams = {
    subject:'subject',
    jsonMessage:{'jsonMessage':'jsonMessage'}
};

describe('notifications.service', function() {
    it('sendEmailNotification', function (done) {
        this.timeout(15000);
        notificationsService.sendEmailNotification(fakeParams,function(err, data){
            assert.equal(err, null);
            assert(data);
            assert(data.accepted);
            done();
        });
    });

});

