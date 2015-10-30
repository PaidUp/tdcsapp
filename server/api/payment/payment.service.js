'use strict';

var mongoose = require('mongoose');
var config = require('../../config/environment');
var paymentAdapter = require('./payment.adapter');
var commerceService = require('../commerce/commerce.service');
var userService = require('../user/user.service');
var mongoose = require('mongoose');
var logger = require('../../config/logger');
var async = require('async');
var camelize = require('camelize');
var paymentEmailService = require('./payment.email.service');
var tdPaymentService = require('TDCore').paymentService;
var mix = require('../../config/mixpanel');
var uuid = require('node-uuid');


function createCustomer(user, cb) {
  tdPaymentService.init(config.connections.payment);
  var customer = {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    id:  user._id
  }
  tdPaymentService.createCustomer(customer, function(err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
}

function updateCustomer(dataCustomer, cb) {
  tdPaymentService.init(config.connections.payment);
  tdPaymentService.updateCustomer(dataCustomer, function(err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
}

function fetchCustomer(customerId, cb) {
  tdPaymentService.init(config.connections.payment);
  tdPaymentService.fetchCustomer(customerId, function(err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
}

function createCard(cardDetails, cb) {
  tdPaymentService.init(config.connections.payment);
  tdPaymentService.createCard(cardDetails, function(err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
}

function associateCard(customerId, cardId, cb) {
  tdPaymentService.init(config.connections.payment);
  tdPaymentService.associateCard({customerId:customerId, cardId:cardId}, function(err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
}

function createBank(bankDetails, cb) {
  tdPaymentService.init(config.connections.payment);
  tdPaymentService.createBank(bankDetails, function(err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
}

function associateBank(customerId, token, cb) {
  tdPaymentService.init(config.connections.payment);
  tdPaymentService.associateBank({customerId:customerId, token:token}, function(err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
}

function createOrder(providerId, description, cb) {
  tdPaymentService.init(config.connections.payment);
  tdPaymentService.createOrder({merchantCustomerId:providerId, description:description}, function(err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
}

function debitCard(cardId, amount, description, appearsOnStatementAs, customerId, providerId, fee, metaPayment,cb) {
  tdPaymentService.init(config.connections.payment);
  tdPaymentService.debitCard({cardId:cardId, amount:amount, description:description,
    appearsOnStatementAs:appearsOnStatementAs, customerId:customerId,
    providerId:providerId, fee : fee, meta:metaPayment}, function(err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
}

function debitBank(bankId, amount, description, appearsOnStatementAs, orderId, cb) {
  tdPaymentService.init(config.connections.payment);
  tdPaymentService.debitBank({bankId:bankId,
    amount:amount, description:description,
    appearsOnStatementAs:appearsOnStatementAs,
    orderId:orderId}, function(err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
}

function associateBank(customerId, token, cb) {
  tdPaymentService.init(config.connections.payment);
  tdPaymentService.associateBank({customerId:customerId, token:token}, function(err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
}

function listCustomerBanks(customerId, cb) {
  tdPaymentService.init(config.connections.payment);
  tdPaymentService.listCustomerBanks(customerId, function(err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
}

function listCards(customerId, cb) {
  tdPaymentService.init(config.connections.payment);
  tdPaymentService.listCards(customerId, function(err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
}

function createBankVerification(bankId, cb) {
  tdPaymentService.init(config.connections.payment);
  tdPaymentService.createBankVerification({bankId : bankId}, function(err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
}

function loadBankVerification(verificationId, cb) {
  tdPaymentService.loadBankVerification(verificationId, function(err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
}

function deleteBankAccount(customerId, bankId, cb) {
  tdPaymentService.init(config.connections.payment);
  tdPaymentService.deleteBankAccount({bankId:bankId}, function(err, data){
    if(err) return cb(err);
    listBanks(customerId, function(err, dataBanks){
      if(dataBanks.bankAccounts.length === 0){
        userService.find({'meta.TDPaymentId':customerId}, function(err, user){
          user[0].payment = {};
          userService.save(user[0], function(err, dataUpdateUser){
            if(err){
              return cb(err);
            }
          });
        });
      }
      return cb(null, data);
    });
  });
}

function confirmBankVerification(customerId, bankId, amount1, amount2, cb) {
  tdPaymentService.init(config.connections.payment);
  tdPaymentService.confirmBankVerification({customerId:customerId, bankId:bankId, amount1:amount1, amount2:amount2}, function(err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
}

function updateOrderDescription(orderId, description, cb) {
  tdPaymentService.init(config.connections.payment);
  tdPaymentService.updateOrderDescription({orderId:orderId, description:description}, function(err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
}

function collectPendingOrders(cb) {
  commerceService.orderList({status: ["pending","processing"]}, function(err, data) {
    var orderList = [];
    if (err) return cb(err);
    async.eachSeries(data, function (order, callback) {
      commerceService.orderLoad(order.incrementId, function (err, data) {
        if (err) return cb(err);
        orderList.push(data);
        callback();
      });
    }, function (err) {
      if (err) {
        throw err;
      }
      return cb(null, orderList);
    });
  });
}

function createOrder(merchantCustomerId, description, cb) {
  tdPaymentService.init(config.connections.payment);
  tdPaymentService.createOrder({merchantCustomerId:merchantCustomerId, description:description}, function (err, data) {
    if(err) return cb(err);
    return cb(null, data.orders[0].id);
  });
}

function listBanks (customerId, cb) {
  tdPaymentService.init(config.connections.payment);
  tdPaymentService.listCustomerBanks(customerId, function(err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
}

/**
 * Prepare user for Balanced Payments
 * @param user
 * @param cb
 */
function prepareUser(user, cb) {
  if(user.meta.TDPaymentId === '') {
    createCustomer(user, function(err, data) {
      if (err) return cb(err);
      user.meta.TDPaymentId = data.id;
      userService.save(user,function(err, data){
        if (err) return cb(err);
        return cb(null, data);
      });
    });
  }
  else {
    return cb(null, user);
  }
}

function prepareCard(userId, cardId, cb) {
  tdPaymentService.init(config.connections.payment);
  tdPaymentService.fetchCard(userId , cardId, function(err, creditCard){
    if(err) return cb(err);
    /*if(creditCard.cards[0].links.customer === null) {
      associateCard(userId, cardId, function (err, data) {
        if(err) return cb(err);
        return cb(null, creditCard);
      });
    }
    else {*/
      return cb(null, creditCard);
    //}
  });
}

function prepareBank(customerId, bankId, cb) {
  tdPaymentService.init(config.connections.payment);
  tdPaymentService.fetchBank(customerId, bankId, function(err, bank){
    if(err) return cb(err);
    //if(bank.bankAccounts[0].links.customer === null) {
      //associateBank(userId, bankId, function (err, data) {
        //if(err) return cb(err);
        //return cb(null, bank);
      //});
    //}
    //else {
      return cb(null, bank);
    //}
  });
}

function fetchBank(customerId, bankId, cb){
  if(!bankId){
    return cb(null, null);
  }else{
    tdPaymentService.init(config.connections.payment);
    tdPaymentService.fetchBank(customerId, bankId, function(err, bank){
        if(err) return cb(err);
        return cb(null, bank);
    });
  }

}

function fetchCard(customerId ,cardId, cb){
  tdPaymentService.init(config.connections.payment);
  tdPaymentService.fetchCard(customerId , cardId, function(err, creditCard){
      if(err) return cb(err);
      return cb(null, creditCard);
  });
}

function fetchDebit(debitId, cb){
  tdPaymentService.init(config.connections.payment);
  tdPaymentService.fetchDebit(debitId, function(err, bank){
    if(err) return cb(err);
    return cb(null, bank);
  });
}

function debitOrderCreditCard(orderId, userId, providerId, amount, cardId, scheduleId, fee, metaPayment, retryId, cb) {
  // 2a) Prepare BP customer
  logger.info('2a) Prepare BP customer');
  userService.find({_id: userId}, function (err, user) {
    if(err) return cb(err);
    prepareUser(user[0], function (err, userp) {
      if(err) return cb(err);
      logger.info('2b) Associate BP customer credit card');
      // 2b) Associate BP customer credit card
      prepareCard(userp.meta.TDPaymentId, cardId, function (err, cardDetails) {
        if(err) return cb(err);
        logger.info('2c) Create BP Order');
          //commerceService.addCommentToOrder(orderId, JSON.stringify({BPOrderId: BPOrderId},null, 4), 'pending', function (err, result) {
           // logger.info('2e) Debit BP credit card, order.');
            // 2d) Debit BP credit card
            debitCard(cardId, amount, "Magento: "+orderId, config.balanced.appearsOnStatementAs,
              userp.meta.TDPaymentId, providerId, fee, metaPayment, function(err, data) {
              //if(err) return cb(err);
              if(data && data.status == 'succeeded') {
                logger.info('2f) Create Magento transaction');
                // 2e) Create Magento transaction
                var result = {amount: amount, OrderId: data.id, DebitId: data.id,
                  paymentMethod: "creditcard", number: cardDetails.last4,
                  brand : cardDetails.brand, scheduleId : scheduleId, status:data.status, retryId:retryId};
                commerceService.addTransactionToOrder(orderId, data.id, result, function(err, data){
                  if(err) return cb(err);
                  return cb(null, result);
                });
              }
              else {
                var result = {amount: amount, OrderId: uuid.v4(), DebitId: uuid.v4(),
                  paymentMethod: "creditcard", number: cardDetails.last4, brand : cardDetails.brand,
                  scheduleId : scheduleId, status:'failed', message:err.message, retryId:retryId};
                commerceService.addTransactionToOrder(orderId, uuid.v4(), result, function(err, data){
                  if(err) return cb(err);
                  return cb(data);
                });
                //return cb(data);
              }
            });
          //});

      });
    });
  });
}

function debitOrderDirectDebit(orderId, userId, providerId, amount, bankId, fee, metaPayment, cb) {
  console.log('debitOrderDirectDebit',orderId, userId, providerId, amount, bankId, fee, metaPayment);
  // 2a) Prepare BP customer
  logger.info('2a) Prepare BP customer');
  userService.find({_id: userId}, function (err, user) {
    if(err) return cb(err);

    var TDPaymentId = user[0].meta.TDPaymentId;

    prepareUser(user[0], function (err, user) {
      if(err) return cb(err);
      logger.info('2b) Associate BP customer bank account');
      // 2b) Associate BP customer credit card
      // TODO jesse
      prepareBank(TDPaymentId, bankId, function (err, bankDetails) {
        if(err) return cb(err);
        logger.info('2c) Create BP Order');
        // 2c) Create BP Order
        //createOrder(merchantId, orderId, function(err, BPOrderId) {
          //if(err) return cb(err);
          //logger.info('2d) Report BP Order to Magento.');
          //commerceService.addCommentToOrder(orderId, JSON.stringify({BPOrderId: BPOrderId},null, 4), 'pending', function (err, result) {
            if (err) return cb(err);
            logger.info('2e) Debit BP bank account, order.');
            // 2d) Debit BP credit card //
            debitCard(bankId, amount, "Magento: "+orderId, config.balanced.appearsOnStatementAs, user.meta.TDPaymentId, providerId, fee, metaPayment, function(err, data) {
            //debitBank(bankId, amount, "Magento: "+orderId, config.balanced.appearsOnStatementAs, orderId, function(err, data) {
              //console.log('err',err);
              //console.log('data',data);
              if(err) return cb(err);
              if(data.debits[0].status == 'succeeded') {
                logger.info('2f) Create Magento transaction');
                // 2e) Create Magento transaction
                var result = {amount: amount, orderId: orderId, BPDebitId: data.debits[0].id,
                  paymentMethod: "directdebit", account: bankDetails.bankAccounts[0].accountNumber,
                  bankName: bankDetails.bankAccounts[0].bankName, accountType: bankDetails.bankAccounts[0].accountType};
                commerceService.addTransactionToOrder(orderId, orderId, result, function(err, data){
                  if(err) return cb(err);
                  return cb(null, result);
                });
              }
              else {
                // Debit failed
                return cb(data);
              }
            });
          //});
        //});
      });
    });
  });
}

function capture(order, user, providerId, amount, paymentMethod, scheduleId, fee, metaPayment, retryId, cb) {
  logger.info('1) paymentService > Processing ' + order.incrementId);
  if(paymentMethod == "creditcard") {
    var paymentId = order.cardId;
    debitOrderCreditCard(order.incrementId, user._id, providerId, amount, paymentId, scheduleId, fee, metaPayment, retryId, function (err, resultDebit) {
      //console.log('resultDebit',resultDebit);
      //console.log('err',err);
      // Debit failed
      if (err) {
        //logger.info('Failed, add a comment and mark order as "on hold"');
        // 3) Add a comment and mark order as "processing"
        commerceService.addCommentToOrder(order.incrementId, "Capture failed: " + JSON.stringify(err,null, 4), null, function (subErr, result) {
          //commerceService.orderHold(order.incrementId, function(err, data){
            //TODO
            paymentEmailService.sendFinalEmailCreditCard(user, amount, order, function(error, data){
              mix.panel.track("paymentCaptureSendFinalEmailCreditCard", mix.mergeDataMixpanel(order, user._id));
              logger.log('info', 'send email final email ' + data );
            });

            return cb(err);
          //});
        });
      }
      else {
        // Debit succeed
        logger.info('3) Success, add a comment and mark order as "processing"');
        // 3) Add a comment and mark order as "processing"
        commerceService.addCommentToOrder(order.incrementId, "Capture succeed, transaction: " + resultDebit, 'processing', function (err, result) {
          if (err) return cb(err);
          //TODO
          paymentEmailService.sendProcessedEmailCreditCard(user, amount, resultDebit.number, order.incrementId, function(err, data){
            mix.panel.track("paymentCaptureSendProcessedEmailCreditCard", mix.mergeDataMixpanel(order, user._id));
            logger.log('info', 'send processed email. ' + data );
          });

          return cb(null, resultDebit.BPOrderId);
        });
      }
    });
  }
  else if(paymentMethod == "directdebit") {
    /*getUserDefaultBankId(user, function(defaultBankError, paymentId){
      if(defaultBankError) {
        logger.info('Failed, add a comment and mark order as "on hold"');
        // 3) Add a comment and mark order as "processing"
        commerceService.addCommentToOrder(order.incrementId, defaultBankError.name, null, function (err, result) {
          commerceService.orderHold(order.incrementId, function(err, data){
            return cb(defaultBankError);
          });
        });
      }
      else {*/
        // Debit order
        // //TODO jesse //orderId, userId, providerId, amount, bankId, fee, metaPayment,
        debitOrderDirectDebit(order.incrementId, user._id, providerId, amount, order.cardId, fee, metaPayment, function (err, resultDebit) {
          // Debit failed
          if (err) {
            logger.info('Failed, add a comment and mark order as "on hold"');
            // 3) Add a comment and mark order as "processing"
            commerceService.addCommentToOrder(order.incrementId, "Capture failed: " + JSON.stringify(err,null, 4), null, function (subErr, result) {
              commerceService.orderHold(order.incrementId, function(err, data){
                return cb(err);
              });
            });
          }
          else {
            // Debit succeed
            logger.info('3) Success, add a comment and mark order as "processing"');
            // 3) Add a comment and mark order as "processing"
            commerceService.addCommentToOrder(order.incrementId, "Capture succeed, transaction: " + resultDebit.BPOrderId, 'processing', function (err, result) {
              if (err) return cb(err);
              return cb(null, resultDebit.BPOrderId);
            });
          }
        });
      //}
    //});
  }
}

function getUserDefaultBankId(user, cb) {
  // Check bank accounts
  listBanks(user.meta.TDPaymentId, function(err, data){
    if(err) return cb(err);
    if(data.length == 0) {
      // error
      return cb({name: 'not-available-payment'}, null);
    }
    var bank;
    for (var i = 0; i < data.length; i++) {
      bank = data[i];
      if(bank.state == 'verified') {
        return cb(null, bank.id);
      }
    }
    return cb({name: 'not-bank-verified'}, null);
  });
}

function setUserDefaultBank(user, cb) {
  getUserDefaultBankId(user, function(err, data){
    if(err && (err.name == 'not-bank-verified')) {
      user.payment = {verify:{status:'pending'}};
      userService.save(user, function(err, dataUpdateUser){
        if(err){
          return cb(err);
        }
        return cb(null,dataUpdateUser.payment);
      });
    }
    else if(err && (err.name == 'not-available-payment')) {
      user.payment = {};
      userService.save(user, function(err, dataUpdateUser){
        if(err){
          return cb(err);
        }
        return cb(null,dataUpdateUser.payment);
      });
    }
    else {
      user.payment = {verify:{status:'succeeded'}};
      userService.save(user, function(err, dataUpdateUser){
        if(err){
          return cb(err);
        }
        return cb(null,dataUpdateUser.payment);
      });
    }
  })
}

function getUserDefaultCardId(user, cb) {
  // Check bank accounts
  listCards(user.meta.TDPaymentId, function(err, data){
    if(err) return cb(err);
    if(data.data.length == 0) {
      // error
      return cb({name: 'not-available-payment'}, null);
    }
    var card = data.data[0];
    return cb(null, card.id);
  });
}

function createConnectAccount(account, cb) {
  tdPaymentService.init(config.connections.payment);
  tdPaymentService.createConnectAccount(account, function(err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
}

function addBankConnectAccount(bankDetails, cb) {
  tdPaymentService.init(config.connections.payment);
  tdPaymentService.addBankToAccount(bankDetails, function(err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
}

function addToSCustomer(tosDetails, cb) {
  tdPaymentService.init(config.connections.payment);
  tdPaymentService.addToSCustomer(tosDetails, function(err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
}

function addLegalCustomer(legalDetails, cb) {
  tdPaymentService.init(config.connections.payment);
  tdPaymentService.addLegalCustomer(legalDetails, function(err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
}

function updateAccount(dataDetails, cb) {
  tdPaymentService.init(config.connections.payment);
  tdPaymentService.updateAccount(dataDetails, function(err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
}

exports.paymentAdapter = paymentAdapter;
exports.createCustomer = createCustomer;
exports.associateCard = associateCard;
exports.associateBank = associateBank;
exports.debitCard = debitCard;
exports.createCard = createCard;
exports.createBank = createBank;
exports.createOrder = createOrder;
exports.listCustomerBanks = listCustomerBanks;
exports.listCards = listCards;
exports.createBankVerification = createBankVerification;
exports.loadBankVerification = loadBankVerification;
exports.confirmBankVerification = confirmBankVerification;
exports.updateOrderDescription = updateOrderDescription;
exports.prepareUser = prepareUser;
exports.collectPendingOrders = collectPendingOrders;
exports.debitOrderCreditCard = debitOrderCreditCard;
exports.debitOrderDirectDebit = debitOrderDirectDebit;
exports.capture = capture;
exports.getUserDefaultBankId = getUserDefaultBankId;
exports.listBanks = listBanks;
exports.setUserDefaultBank = setUserDefaultBank;
exports.fetchBank = fetchBank;
exports.fetchCard = fetchCard;
exports.fetchDebit = fetchDebit;
exports.getUserDefaultCardId = getUserDefaultCardId;
exports.deleteBankAccount = deleteBankAccount;
exports.createConnectAccount = createConnectAccount;
exports.addBankConnectAccount = addBankConnectAccount;
exports.addToSCustomer = addToSCustomer;
exports.addLegalCustomer = addLegalCustomer;
exports.updateAccount = updateAccount;
exports.updateCustomer = updateCustomer;
exports.fetchCustomer = fetchCustomer;
