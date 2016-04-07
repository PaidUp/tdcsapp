'use strict'

var faker = require('faker')

var models = function () {
  this.signup = {
    pass: 'qwerty1Q#!',
    fakeEmail: faker.internet.email(),
    firstname: 'Zuly',
    lastname: 'Alcaraz'
  }

  this.athlete = {
    firstName: 'Santiago',
    lastName: 'Escobar',
    gender: 'male',
    date: {
      month: '2',
      day: '17',
      year: '1995'
    }
  }

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
  }

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
  }

  this.teamName = 'Austin Vipers'

  this.bankDetails = {
    routingNumber: '123123123',
    accountNumber: '1234567890',
    valueVerifyAccount: 1,
    valueVerifyAccountError: 2
  }

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
      securityCode: '123',
      zipCode: '12321'
    }
  }

  this.provider = {
    teamName: faker.company.companyName(),
    ownerFirstName: faker.name.firstName(),
    ownerLastName: faker.name.lastName(),
    onwerDOB: faker.date.past(),
    month: '7',
    day: '29',
    year: '1987',
    Address: faker.address.streetAddress(),
    ownerSSN: '000000000',
    ownerEmail: faker.internet.email(),
    ownerPhone: faker.phone.phoneNumber(),
    city: faker.address.city(),
    state: 'Tx',
    zipCode: '12312',
    EIN: '000000000',
    businessType: 'Corporation',
    businessName: faker.company.companyName(),
    aba: '110000000',
    dda: '000123456789',
    ddaVerification: '000123456789',
    referralCode: 'referralCode'
  }
}

module.exports = new models()
