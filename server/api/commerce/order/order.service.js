/**
 * Created by riclara on 3/21/16.
 */
'use strict'

var CommerceConnector = require('pu-commerce-connect');
var ScheduleConnector = require('pu-schedule-connect');
var config = require('../../../config/environment');
var CatalogService = require('../catalog/catalog.service');
var userService = require('../../user/user.service');
var paymentEmailService = require('../../payment/payment.email.service');
var paymentService = require('../../payment/payment.service');
var logger = require('../../../config/logger');



var OrderService = {

  calculatePrices : function calculatePrices(body, cb){
  CatalogService.catalogProduct(body.productId, function (errProduct, dataProduct) {
    if (errProduct) {
      return cb(errProduct);
    }
    let fm = JSON.parse(dataProduct.feeManagement);
    let dues = fm.paymentPlans[body.paymentPlanSelected].dues;
    let params = [];

    dues.forEach(function (ele, idx, arr) {
      ele.applyDiscount = body.discount > 0;
      ele.discount = body.discount;
      ele.couponId = body.couponId

      params.push({
        originalPrice: ele.amount,
        stripePercent: fm.processingFees.cardFeeActual,
        stripeFlat: fm.processingFees.cardFeeFlatActual,
        paidUpFee: fm.collectionsFee.fee,
        discount: ele.applyDiscount ? ele.discount : 0,
        payProcessing: fm.paysFees.processing,
        payCollecting: fm.paysFees.collections,
        description: ele.description,
        dateCharge: ele.dateCharge
      });


    });

    let reqSchedule = {
      baseUrl: config.connections.schedule.baseUrl,
      token: config.connections.schedule.token,
      prices: params
    }

    ScheduleConnector.calculatePrices(reqSchedule).exec({
      // An unexpected error occurred.
      error: function (err) {
        return cb(err);
      },
      // OK.
      success: function (prices) {
        console.log('prices111', prices.body.prices)
        return cb(null, prices.body.prices, dataProduct);
      }
    });
  })
},

  newOrder : function newOrder(body, prices, dataProduct, cb){

    let fm = JSON.parse(dataProduct.feeManagement);

    let orderReq = {
      baseUrl: config.connections.commerce.baseUrl,
      token: config.connections.commerce.token,
      userId: body.userId,
      paymentsPlan: []
    }
    prices.forEach(function (ele, idx, arr) {
      orderReq.paymentsPlan.push({
        email: body.email,
        destinationId: dataProduct.tDPaymentId,
        dateCharge: ele.dateCharge,
        price: ele.owedPrice,
        discount: body.discount,
        discountCode: body.couponId,
        paymentId: body.paymentId,
        wasProcessed: false,
        status: 'pending',
        processingFees: fm.processingFees,
        collectionsFee: fm.collectionsFee,
        paysFees: fm.paysFees,
        typeAccount: body.typeAccount,
        account: body.account,
        description: ele.description,
        productInfo: {
          productId: dataProduct.productId,
          productName: dataProduct.shortDescription
        },
        userInfo: {
          userId: body.userId,
          userName: body.userName,
        },
        beneficiaryInfo: {
          beneficiaryId: body.beneficiaryId,
          beneficiaryName: body.beneficiaryName

        }


      });
    });
    CommerceConnector.orderCreate(orderReq).exec({
      // An unexpected error occurred.
      error: function (err) {
        return cb(err);
      },
      // OK.
      success: function (orderResult) {
        return cb(null, orderResult);
      },
    });
  },

  updateUser : function updateUser(beneficiaryId, dataProduct){
    //body.beneficiaryId
    let team = {
      seasonEnd: dataProduct.seasonEnd,
      name: dataProduct.name,
      productId: dataProduct.productId,
      createdAt: dataProduct.createdAt,
      sku: dataProduct.sku
    };
    userService.find({_id: beneficiaryId}, function (err, child) {
      child[0].teams.push(team);
      userService.save(child[0], function (err, userAthlete) {
        if(err){
          logger.error('Update User: Error', err);
        }else{
          logger.debug('Update User: ', userAthlete);
        }
      })
    });
  },

  sendEmail : function sendEmail(body, dataProduct, orderResult){
    //body.email
    paymentService.fetchCard(body.paymentId, body.account, function (err, card) {
      let emailParams = {
        orderId: orderResult.body._id,
        email: body.email,
        last4: card.last4,
        amount: 0,
        schedules: [],
        product: dataProduct.name
      }
      orderResult.body.paymentsPlan.forEach(function (ele, idx, arr) {
        emailParams.amount = emailParams.amount + ele.price;
        emailParams.schedules.push({
          nextPaymentDue: ele.dateCharge,
          price: ele.price
        });
      })
      paymentEmailService.sendNewOrderEmailV2(emailParams, function (err, data) {
        if(err){
          logger.error('Send New Order Email: Error', err);
        }else{
          logger.debug('Send New Order Email: ', data);
        }
      });
    });
  }
}

function createOrder (body, cb){
  logger.debug('Create Order: Params', body);
  OrderService.calculatePrices(body, function(errPrices, prices, dataProduct){
    if(errPrices){
      logger.error('Create Order: Error Prices', errPrices);
      return cb(errPrices)
    } else{
      logger.debug('Create Order: Prices', prices);
      logger.debug('Create Order: Data Product Prices', dataProduct);

      OrderService.newOrder(body, prices, dataProduct, function(errorOrderResult, orderResult){
        if(errorOrderResult){
          logger.error('Create Order: Error New Order', orderResult);
          return cb(errorOrderResult);
        } else{
          logger.debug('Create Order: New Order', dataProduct);
          OrderService.updateUser(body.beneficiaryId, dataProduct);
          OrderService.sendEmail(body,dataProduct,orderResult);
          cb(null, orderResult);
        }
      });
    }
  })
};



module.exports = {

  createOrder: createOrder

}
