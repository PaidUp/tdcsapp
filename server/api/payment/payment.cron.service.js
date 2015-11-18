'use strict';

var _ = require('lodash');
var path = require('path');
var config = require('../../config/environment');
var paymentService = require('./payment.service');
var loanService = require('../loan/loan.service');
var userService = require('../user/user.service');
var async = require('async');
var moment = require('moment');
var logger = require('../../config/logger');
var paymentEmailService = require('./payment.email.service');
var loanApplicationService = require('../loan/application/loanApplication.service');
var mix = require('../../config/mixpanel');
var commerceService = require('../commerce/commerce.service');
var notifications = require('../notifications/notifications.service');
var async = require('async');
var businessDays = require('moment-business-days');

//refactor
//generic funciton that retrieve orders pending and processing.
function collectPendingOrders(callback){
  logger.log('info','paymentCronService.collectPendingOrders');
  paymentService.collectPendingOrders(function (err, pendingOrders){
    if(err){
      callback(err);
    }
    callback(null, pendingOrders);
  });
}
//cron
exports.collectAccounts = function(cb){
  async.waterfall([
    collectPendingOrders,
    paymentSchedule
  ], function(err, result){
    cb(null, true);
  });
}
//cron payments
function paymentSchedule(pendingOrders, callbackSchedule){
  async.eachSeries(pendingOrders,
    function(order, callbackEach){
      commerceService.paymentsSchedule({orderId:order.incrementId}, function(err, orderSchedule){
        if(err){
          return callbackEach(err);
        }
        if(!orderSchedule.scheduled.schedulePeriods){
          logger.log('warn', 'order without schedulePeriods: ' + order.incrementId );
          callbackEach();
          //return callbackEach(new Error('order without schedulePeriods'));
        }
        async.eachSeries(orderSchedule.scheduled.schedulePeriods,
          function(schedulePeriod, callbackEach2){
            if(schedulePeriod.transactions.length === 0 && moment(schedulePeriod.nextPaymentDue).isBefore(moment())){
              userService.find({_id : order.userId}, function(err, users){
                paymentService.fetchCustomer(users[0].meta.TDPaymentId, function(err, paymentUser){
                  if(paymentUser && paymentUser.defaultSource){
                    order.cardId = paymentUser.defaultSource;
                  }
                  paymentService.capture(order, users[0], order.products[0].TDPaymentId, schedulePeriod.price,
                    order.paymentMethod, schedulePeriod.id, schedulePeriod.fee, orderSchedule.scheduled.meta, null, function(err , data){
                    if(err){
                      console.log('email notification error (important) err', err)
                      notifications.sendEmailNotification({subject:'invalid order', jsonMessage:{order:order.incrementId, message:err || 'error unknown'}}, function(err, data){
                      });
                      return callbackEach2();
                    }

                    return callbackEach2();
                  });
                });
              });
            }else{
              callbackEach2();
            }
          },
          function(err){
            if(err){
              return callbackEach(err);
            }
            callbackEach();
          });
        //callback(null, schedule);
      });
    },
    function(err){
      if(err){
        return callbackSchedule(err);
      }
      return callbackSchedule();
    })
}

//end refactor

function sendEmailReminder(pendingOrders, callback){
  logger.log('info','paymentCronService.sendEmailReminder');
  var reminderPeriod = config.notifications.reminderEmailPayment.period || 'hours';
  var reminderValue = config.notifications.reminderEmailPayment.value || 72;
  if(pendingOrders.length === 0){
    return callback(null, true);
  }/*
  pendingOrders.map(function(order){
    logger.log('info','iterate each order', order.incrementId);
    order.schedulePeriods.map(function(schedule){
      logger.log('info','iterate each orderSchedule', schedule.id);
      var reminderDate = moment(new Date).add(reminderValue, reminderPeriod);
      var shouldReminder = moment(schedule.nextPaymentDue).isBetween(reminderDate.subtract(12, 'hours').format(), reminderDate.add(12, 'hours').format());
      if(shouldReminder){
        logger.log('info','should send Email Reminder',schedule.id);
        paymentEmailService.sendEmailReminderPyamentParents(order.userId,order.sku.replace('_',' ').replace('-',' '), schedule, reminderValue, reminderPeriod, function (err, data){
          logger.log('info','send Email Reminder data',data);
          logger.log('info','send Email Reminder err',err);
          return callback(null, true);
        });
      }else{
        return callback(null, true);
      }
    });
  });*/

  async.eachSeries(pendingOrders, function(order, cb) {
    logger.log('info','iterate each order', order.incrementId);

    /*order.schedulePeriods.map(function(schedule){
      logger.log('info','iterate each orderSchedule', schedule.id);
      var reminderDate = moment(new Date).add(reminderValue, reminderPeriod);
      var shouldReminder = moment(schedule.nextPaymentDue).isBetween(reminderDate.subtract(12, 'hours').format(), reminderDate.add(12, 'hours').format());
      if(shouldReminder){
        logger.log('info','should send Email Reminder',schedule.id);
        paymentEmailService.sendEmailReminderPyamentParents(order.userId,order.sku.replace('_',' ').replace('-',' '), schedule, reminderValue, reminderPeriod, function (err, data){
          logger.log('info','send Email Reminder data',data);
          logger.log('info','send Email Reminder err',err);
        });
        return cb(null,true);
      }else{
      return cb(null,true);
      }
    });*/

    async.eachSeries(order.schedulePeriods, function(schedule, cbSchedule) {
      logger.log('info','iterate each orderSchedule', schedule.id);
      var reminderDate = moment(new Date).add(reminderValue, reminderPeriod);
      var shouldReminder = moment(schedule.nextPaymentDue).isBetween(reminderDate.subtract(12, 'hours').format(), reminderDate.add(12, 'hours').format());
      if(shouldReminder){
        logger.log('info','should send Email Reminder',schedule.id);
        userService.find({_id:order.userId}, function(err, user){
          if (!err && user[0]) {
            paymentService.listCards(user[0].meta.TDPaymentId, function(err, card){
              if(!err){
                var nameTeam = order.products[0].shortDescription || order.products[0].description || order.sku.replace('_',' ').replace('-',' ');
                paymentEmailService.sendEmailReminderPyamentParents(user, nameTeam, schedule, reminderValue, reminderPeriod, card, function (err, data){
                  logger.log('info','send Email Reminder data',data);
                  logger.log('info','send Email Reminder err',err);
                });
              };
            });
          }
        });
        return cbSchedule(null,true);
      }else{
      return cbSchedule(null,true);
      }

    }, function(err){
        // if any of the file processing produced an error, err would equal that error
      if( err ) {
      } else {
        logger.log('info','All order.schedule have been processed successfully');
        return cb(null, true);
      }
    });

  }, function(err){
      // if any of the file processing produced an error, err would equal that error
      if( err ) {
      } else {
        logger.log('info','All orders have been processed successfully');
        return callback(null, true);
      }
  });
}

exports.retryPaymentSchedule = function (callbackSchedule){
  logger.info('init retryPaymentSchedule');
  commerceService.getListRetryPayment(function(err, pendingOrders){
    if(err){
      logger.error(err);
      throw new Error(err);
    }else{
      async.eachSeries(pendingOrders, function(order, callbackEach){
          if(!order.schedulePeriods){
            logger.log('warn', 'order without schedulePeriods: ' + order.incrementId );
            callbackEach();
            //return callbackEach(new Error('order without schedulePeriods'));
          }
          if(!order.retrySchedules){
            logger.log('warn', 'order without retrySchedules: ' + order.incrementId );
            callbackEach();
            //return callbackEach(new Error('order without schedulePeriods'));
          }else{
            async.eachSeries(order.retrySchedules, function(retrySchedule, cbRetry){
              async.eachSeries(order.schedulePeriods,
                function(schedulePeriod, callbackEach2){
                  if(retrySchedule.scheduleId === schedulePeriod.id){
                    userService.find({_id : order.userId}, function(err, users){
                      paymentService.fetchCustomer(users[0].meta.TDPaymentId, function(err, paymentUser){
                        if(paymentUser && paymentUser.defaultSource){
                          order.cardId = paymentUser.defaultSource;
                        }
                        paymentService.capture(order, users[0], order.products[0].TDPaymentId, schedulePeriod.price,
                          order.paymentMethod, schedulePeriod.id, schedulePeriod.fee, order.meta, retrySchedule.retryId, function(err , data){
                          if(err){
                            notifications.sendEmailNotification({subject:'invalid order', jsonMessage:{order:order.incrementId, message:err}}, function(err, data){
                            });
                            return callbackEach2(err);//here, return ok, and send email.
                          }
                          return callbackEach2();
                        });
                      });
                    });
                  } else{
                    callbackEach2();
                  }
                },
                function(err){
                  if(err){
                    logger.error(err);
                  }
                  cbRetry();
                });
              //callback(null, schedule);

            },function(retryErr){
              if(retryErr) logger.error(retryErr);
              callbackEach();
            });
          }
        },
        function(err){
          if(err){
            return callbackSchedule();
          }
          return callbackSchedule();
        })
    }

  });
}

exports.sendEmailReminderParents = function(cb){
  async.waterfall([
    collectPendingOrders,
    sendEmailReminder
  ], function(err, result){
    cb(null, true);
  });
}

exports.collectOneTimePayments = function (cb) {
  logger.log('info', 'into collectOneTimePayments');
  var results = [];

  // 1) Load "pending" magento orders with all "comments"
  paymentService.collectPendingOrders(function (err, data) {
    logger.log('info', 'err: '+ err);
    async.eachSeries(data, function (order, callback) {
      if (order.paymentMethod === 'creditcard' && order.payment === 'onetime') {
        userService.find({_id : order.userId}, function (err, user){
          paymentService.capture(order, user[0], order.products[0].TDPaymentId, order.grandTotal, order.paymentMethod, function(err, data){
            if (err) callback(err);
            callback();
          });
        });
      }
      else {
        callback();
      }
    }, function (err) {
      if (err) {
        logger.log('error', err);
        return cb(err);
      }
      return cb(null, true);
    });
  });
}

exports.collectLoanPayments = function (period, cb) {
  var isFinished = false;
  var currentDate = moment();
  // List active loans
  loanService.find({state: 'active'}, function(err, loans) {
    // Collect pending schedule
    async.eachSeries(loans, function (loan, mainCallback) {
      var payments = [];

      async.each(loan.schedule, function(paymentScheduled, callback) {
        var paymentDate = moment(paymentScheduled.paymentDay);
        if (currentDate.year() === paymentDate.year() &&
          currentDate.month() === paymentDate.month() &&
          currentDate.date() === paymentDate.date() &&
          paymentScheduled.state === 'pending') {
          switch (period) {
            case 'hours':
              if (currentDate.hour() === paymentDate.hour()) {
                payments.push(loan.schedule.indexOf(paymentScheduled));
                callback();
              }
              break;
            case 'minutes':
              if (currentDate.hour() === paymentDate.hour() &&
                currentDate.minute() === paymentDate.minute()) {
                payments.push(loan.schedule.indexOf(paymentScheduled));
                callback();
              }
              break;
            default:
              payments.push(loan.schedule.indexOf(paymentScheduled));
              callback();
          }
        }
        else {
          callback();
        }
      }, function(err){

      });

      // Capture
      async.eachSeries(payments, function(paymentId, callback) {
        loanService.captureLoanSchedule(loan, paymentId, function (err, data) {


          if(err) callback(err);
            callback();
          });
        }, function (err) {
            if (err) {
              logger.log('error', err);
              mainCallback(err);
        }
          mainCallback();
      });

    }, function (err) {
      if (err) {
        logger.log('error', err);
        return cb(err);
      }
      if(!isFinished){
        isFinished = true;
        return cb(null, true);
      }

    });
  });
}

exports.sendRemindToAddPaymentMethod = function(cb){
  var period = config.notifications.reminderNoPaymentAdded.period;
  var value = config.notifications.reminderNoPaymentAdded.value;
  var currentDate = moment();
  // List active loans
  loanService.find({state: 'active'}, function(err, loans) {
    // Collect pending schedule
    async.eachSeries(loans, function (loan, mainCallback) {
      ValidateBankAccount(loan.applicationId, function(err, bankId){
        if(!err){
          mainCallback();
        }
        else if(err.name === 'not-available-payment'){
          if(!loan.notifications){
            loan.notifications = [];
          }
          var noticationsLength = loan.notifications.length;
          var isnotified = false;
          var oneHourAfter = new moment(loan.createAt).add(value, period);
          if (currentDate.isAfter(oneHourAfter)) {
            for(var i=0; i<noticationsLength && !isnotified;i++)
            {
              if(loan.notifications[i].type === 'reminderNoPaymentAdded'){
                isnotified = true;
              }
            }
            if(!isnotified){
              var objNotification = {
                type:'reminderNoPaymentAdded',
                sentDate: new moment().format()
              };
              loan.notifications.push(objNotification);
              loanService.save(loan, function(err, newLoan){
                  paymentEmailService.sendRemindToAddPaymentMethod(loan.applicationId,loan.orderId,function(err, data){
                    mix.panel.track("paymentCronServiceSendRemindAddPaymentMethod", mix.mergeDataMixpanel(loan,loan.applicationId.applicantUserId));
                    logger.log('info', 'send email remind to add payment method. ');
                    //Sent email.
                    mainCallback();
                  });
              });
            }else{
              mainCallback();
            }
          }
          else {
            mainCallback();
          }
        }else{
          mainCallback();
        }
      });

    }, function (err) {
      if (err) {
        logger.log('error', err);
        return cb(err);
      }
        return cb(null, true);
    });
  });
}

exports.sendRemindToVerifyAccount = function(cb){
  var period = config.notifications.reminderNoBankAccountVerified.period;
  var value = config.notifications.reminderNoBankAccountVerified.value;
  var currentDate = new moment();
  // List active loans
  loanService.find({state: 'active'}, function(err, loans) {
    // Collect pending schedule
    async.eachSeries(loans, function (loan, mainCallback) {

      ValidateBankAccount(loan.applicationId, function(err, bankId){
        if(!err){
          mainCallback();
        }
        else if(err.name === 'not-bank-verified'){
          if(!loan.notifications){
            loan.notifications = [];
          }
          var noticationsLength = loan.notifications.length;
          var isnotified = false;
          var twoDayBefore = new moment(loan.schedule[0].paymentDay).subtract(value, period);
          if (currentDate.isAfter(twoDayBefore) && currentDate.isBefore(loan.schedule[0].paymentDay) && loan.schedule[0].state === 'pending'){
            for(var j=0; j<noticationsLength && !isnotified;j++)
            {
              if(loan.notifications[j].type === 'reminderNoBankAccountVerified'){
                isnotified = true;
              }
            }
            if(!isnotified){
              var objNotification = {
                type:'reminderNoBankAccountVerified',
                sentDate: new moment().format()
              };
              loan.notifications.push(objNotification);
              loanService.save(loan, function(err, newLoan){
                  paymentEmailService.sendRemindToVerifyAccount(loan.applicationId, loan.orderId,function(err, data){
                    mix.panel.track("paymentCronServiceSendRemindToVerifyAccount", mix.mergeDataMixpanel(loan,loan.applicationId.applicantUserId));
                    logger.log('info', 'send email remind to verify account. ' + data );
                    //Sent email.
                    mainCallback();
                  });

              });
            }else{
              mainCallback();
            }
          }
          else {
            mainCallback();
          }
        }else{
          mainCallback();
        }
      });

    }, function (err) {
      if (err) {
        logger.log('error', err);
        return cb(err);
      }
        return cb(null, true);
    });
  });
}

exports.sendTomorrowChargeLoan = function(cb){
  var period = config.notifications.reminderChargeAccount.period;
  var value = config.notifications.reminderChargeAccount.value;
  var isFinished = false;
  var currentDate = moment();
  // List active loans
  loanService.find({state: 'active'}, function(err, loans) {
    // Collect pending schedule
    async.eachSeries(loans, function (loan, mainCallback) {
      ValidateBankAccount(loan.applicationId, function(err, bankId){
        if(!err){
          if(!loan.notifications){
            loan.notifications = [];
          }
          var noticationsLength = loan.notifications.length;

          var index = 0;
          async.eachSeries(loan.schedule, function(schedule, callbackSchedule){
            var isnotified = false;
            if (schedule.state === 'pending'){
              var i=0;
              for(i=0;i<noticationsLength && !isnotified;i++){
                if(loan.notifications[i].type === 'reminderChargeAccount' && loan.notifications[i].paymentIndex === index){
                  isnotified = true;
                  callbackSchedule();
                }
              }
              if(!isnotified){
                var oneDayBefore = new moment(schedule.paymentDay).subtract(value, period);
                if(currentDate.isAfter(oneDayBefore) && currentDate.isBefore(schedule.paymentDay)){
                  var objNotification = {
                    type:'reminderChargeAccount',
                    paymentIndex : index,
                    sentDate: new moment().format()
                  };
                  loan.notifications.push(objNotification);
                  loanService.save(loan, function(err, newLoan){
                    paymentEmailService.sendTomorrowChargeLoan({loan:loan,schedule:schedule, days:value,orderId:loan.orderId},function(err, data){
                      mix.panel.track("paymentCronServiceSendTomorrowChargeLoan", mix.mergeDataMixpanel(loan,loan.applicationId.applicantUserId));
                      logger.log('info', 'send email reminder tomorrow charge loan ' );
                      mainCallback();
                    });
                  });
                }else{
                  index = index + 1;
                  callbackSchedule();
                }
              }else{
                index = index + 1;
                callbackSchedule();
              }
            }else{
              index = index + 1;
              callbackSchedule();
            }

          }, function(err){
              if (err) {
                logger.log('error', err);
              }
              return mainCallback();
          });
        }else{
          mainCallback();
        }
      });
    }, function(err) {
      if (err) {
        logger.log('error', err);
        return cb(null,err);
      }
      if(!isFinished){
        isFinished = true;
        return cb(null, true);
      }
    });
  });
}

function ValidateBankAccount(applicationId, cb){
  //var filterLoanApp = {_id:applicationId};
  loanApplicationService.findOne(applicationId, function(err, applicationData){
    var filterUser = {_id: applicationData.applicantUserId};
    userService.find(filterUser, function (err, user) {
      paymentService.getUserDefaultBankId(user[0], function (err, bankId) {
        if(err){
          return cb(err);
        }
        return cb(null, bankId)
      });
    });
  });
}

exports.sendEmailReminderVerifyBank = function(cb){
  async.waterfall([
    collectPendingOrders,
    sendEmailReminderVerifyBankService
  ], function(err, result){
    cb(null, true);
  });
}

function sendEmailReminderVerifyBankService(pendingOrders, callback){
  logger.log('info','paymentCronService.sendEmailReminderVerifyBank');
  var today = moment(new Date());
  if(pendingOrders.length === 0){
    return callback(null, true);
  }
  async.eachSeries(pendingOrders, function(order, cb) {
    logger.info('iterate each order', order.incrementId);
      var orderDate = new Date(order.createdAt);
      //TODO: preconfigurate array to add N business day. example: [3,6,9,12,15]
      var orderDateEnableOne = businessDays(orderDate).businessAdd(1)._d;
      var orderDateEnableTwo = businessDays(orderDate).businessAdd(2)._d;
      var orderDateEnableThree = businessDays(orderDate).businessAdd(3)._d;
      var orderDateEnableFour = businessDays(orderDate).businessAdd(4)._d;
      var orderDateEnableFive = businessDays(orderDate).businessAdd(5)._d;
      var newShouldReminder = [orderDateEnableOne, orderDateEnableTwo, orderDateEnableThree, orderDateEnableFour, orderDateEnableFive
      ].some(function(date){
        return moment(date).isSame(today.format(), 'day');
      });
      if(newShouldReminder && order.paymentMethod === 'directdebit'){
        logger.log('info','should validate pyment method',order.paymentMethod);
        userService.find({_id:order.userId}, function(err, user){
          if (!err && user[0]) {
            //paymentService.listBanks(user[0].meta.TDPaymentId, function(errList, listAccounts){
              paymentService.fetchBank(user[0].meta.TDPaymentId, order.cardId, function(err, account){//customerId, bankId
                logger.log('info','should validate status account',account.status);
                if(!err && account.status === 'new'){
                  //var nameTeam = order.products[0].shortDescription || order.products[0].description || order.sku.replace('_',' ').replace('-',' ');
                  paymentEmailService.sendRemindToVerifyAccount(order.incrementId, user[0], account, orderDate, function (err, data){
                    logger.log('info','send Email Reminder data',data);
                    logger.log('info','send Email Reminder err',err);
                    return cb(null, true);
                  });
                }else{
                  return cb(null, true);
                }
              });
            //});
          }else{
            return cb(null, true);
          }
        });
      }else{
        return cb(null, true);
      }
  }, function(err){
      if( err ) {
      } else {
        logger.log('info','All orders have been processed successfully');
        return callback(null, true);
      }
  });

}

