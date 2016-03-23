'use strict';

var request = require('supertest');
var assert = require('chai').assert;
var service = require('./order.service');

describe('Test Order endpoints', function(){

  this.timeout(10000);

  it('Create Order', function(done){

    let params = {
      productId: '111',
      paymentPlanSelected: 'due3',
      discount: 10,
      couponId: 'XXXXX',
      userId: 'xxxxuserid',
      userName: 'fulanito prueba',
      beneficiaryId: 'beneficiaryidxxxxx',
      beneficiaryName: 'beneficiary name test',
      typeAccount: 'credit',
      account: 'xxxx xxxx xxxx xxxx'
    }
/*
    request("http://localhost:9000")
      .post("/api/v1/commerce/order/create")
      .send(params)
      .expect(200)
      .end(function(err, res){
        console.log('err' , JSON.stringify(err));
        console.log('done' , JSON.stringify(res));


      if (err) return done(err);



      //done();
    });
    */


    service.createOrder(params, function(err, data){
      if(err){
        done(err)
      }else{

        done()
      }
    });

  });

});
