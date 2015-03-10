'use strict';

var Faker = require('faker');

var models = function () {
  
  this.signup = {
    pass: 'qwerty1Q#!',
    fakeEmail: Faker.internet.email(),
    firstname: 'Zuly',
    lastname: 'Alcaraz'
  };
  
  this.athlete = {
    firstName: 'Santiago',
    lastName: 'Escobar',
    gender: 'male',
    date: {
      month: '2',
      day: '17',
      year: '1995'
    }
  };
  
  this.userLoan = {
    firstname: this.signup.firstname,
    lastname: this.signup.lastname,
    address: {
      address1: 'Popeye',
      address2: 'Av Siempre viva',
      city: 'Medellin',
      state: 'Antioquia',
      zipCode: '12345'
    },
    phone: '1234567890',
    inputSSN: '123456789',
    monthlyGrossIncome: '1234'
  };

  this.teamName = 'Austin Boom';

  this.bankDetails = {
    routingNumber: '123123123',
    accountNumber: '1234567890',
    valueVerifyAccount: 1,
    valueVerifyAccountError: 2
  };

  this.creditCardDetails = {
    address: {
      address1: this.userLoan.address.address1,
      address2: this.userLoan.address.address2,
      city: this.userLoan.address.city,
      stateIndex: 6,
      zipCode: this.userLoan.address.zipCode
    },
    phone: '3006004143',
    card: {
      nameOnCard: this.signup.firstname + ' ' + this.signup.lastname,
      cardNumber: '4111111111111111',
      expirationDate: {
        month: '10',
        year: '2020'
      },
      securityCode: '123'
    }
  };
};

module.exports = new models();
