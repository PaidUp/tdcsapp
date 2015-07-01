'use strict';

var faker = require('faker');

var models = function () {
  
  this.signup = {
    pass: 'qwerty1Q#!',
    fakeEmail: faker.internet.email(),
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

  this.userCredentials = {
    newPassword: 'Qwerty1q#!',
    address: {
      address1: this.userLoan.address.address1,
      address2: this.userLoan.address.address2,
      city: this.userLoan.address.city,
      stateIndex: 6,
      zipCode: this.userLoan.address.zipCode
    },
    phone: '3006004143'
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

  this.provider = {
    //Team info
    teamName: faker.company.companyName(),
    teamNumber: faker.random.number(),
    teamAverageSize: faker.random.number()+1,
    teamSport:'Baseball',
    //End team info
    
    //Owner info
    //ownerId: 'xxx',
    ownerName: faker.name.firstName(),
    onwerDOB: faker.date.past(),
    onwerSSN: faker.random.uuid(),
    onwerEmail: faker.internet.email(),
    onwerPhone: faker.phone.phoneNumber(),
    //End owner info
    
    //Billing info
    country: faker.address.country(),
    state: faker.address.state(),
    city: faker.address.city(),
    averagePayment: '500',
    EIN: 'EIN',
    Address: faker.address.streetAddress(),
    website: faker.internet.domainName(),
    businessName: faker.company.companyName(),
    phoneNumber: faker.phone.phoneNumber(),
    //End billing info
    
    //Billing info
    aba: '123',
    dda: '321'
  };
};

module.exports = new models();