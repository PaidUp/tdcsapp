'use strict';
var faker = require('faker');

var data = {
    provider:{
        //Team info
        teamName: faker.company.companyName(),
        teamNumber: faker.random.number(),
        teamAverageSize: faker.random.number()+1,
        teamSport:'Baseball',
        //End team info
        
        //Owner info
        ownerId: 'xxx',
        ownerName: faker.name.firstName(),
        ownerDOB: faker.date.past(),
        ownerSSN: faker.random.uuid(),
        ownerEmail: faker.internet.email(),
        ownerPhone: faker.phone.phoneNumber(),
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
        aba: '110000000',
        dda: '000123456789'
    }
        //encryptKey : 'PZ3oXv2v6Pq5HAPFI9NFbQ==',
        //encryptValue : ''
}

module.exports = data;
