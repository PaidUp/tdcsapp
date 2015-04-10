'use strict';
var faker = require('faker');

var dataPayment = {
    userId:'',
    email:faker.internet.email(),
    firstName : faker.name.firstName(),
    lastName : faker.name.lastName(),
    fullName : function(){
        return this.firstName + ' ' + this.lastName;
    },
    password : 'Querty1!',
    token:'',
    cardToken:'',
    cartId:'',
    athleteId:'',
    gender:'male',
    products: [{"productId":"8","sku":"AUSTIN_BOOM","qty":1,"options":{"4":"10","5":"11"}}],
    cardDetails:{
        number: '4111111111111111',
        expiration_year: '2016',
        expiration_month: '12'
    },
    loanUserId:'',
    applicationId:'',
    loanId:'',
    loanData:function(){
        return {
            firstName:this.firstName,
            lastName:this.lastName,
            ssn:"123456789"
        }
    },
    bankId:'',
    testingApi:'',
    testCustomer:'',
    testMerchant:{
      name: 'Austin Boom',
      email: 'infoo@austinboom.com'
    },
    testCard:'',
    testBank:'',
    verificationId:'',
    testOrderId:'',
    account_number: '9900826301',
    routing_number: '021000021'
};

module.exports = dataPayment;