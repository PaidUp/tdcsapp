/**
 * Created by riclara on 3/21/16.
 */
'use strict'

var CommerceConnector = require('pu-commerce-connect');
var ScheduleConnector = require('pu-schedule-connect');
var config = require('../../../config/environment');
var CatalogService = require('../catalog/catalog.service');
var PUScheduleConnect = require("pu-schedule-connect");


function createOrder(body, cb){

  CatalogService.catalogProduct(body.productId, function(errProduct, dataProduct){
    if(errProduct){
      return cb(errProduct);
    }

    let fm = JSON.parse(dataProduct.feeManagement);

    console.log('PROD**' , dataProduct)
    console.log('FM$$$' , dataProduct.feeManagement)

    let dues = fm.paymentPlans[body.paymentPlanSelected].dues;
    let params = [];

    dues.forEach(function(ele, idx, arr){
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
        description : ele.description,
        dateCharge : ele.dateCharge
      });


    });

    let reqSchedule = {
      baseUrl : config.connections.schedule.baseUrl,
      token : config.connections.schedule.token,
      prices : params
    }


    PUScheduleConnect.calculatePrices(reqSchedule).exec({
// An unexpected error occurred.
      error: function (err){
        return cb(err);
      },
// OK.
      success: function (result){
        let prices = result.body.prices;

        console.log(JSON.stringify(prices))

        let orderReq = {
          baseUrl: config.connections.commerce.baseUrl,
          token: config.connections.commerce.token,
          userId: body.userId,
          paymentsPlan: []
        }

        prices.forEach(function(ele, idx, arr){
          orderReq.paymentsPlan.push({
            destinationId: dataProduct.tDPaymentId,
            dateCharge: ele.dateCharge,
            price: ele.owedPrice,
            discount: body.discount,
            discountCode: body.couponId,
            wasProcessed: false,
            status: 'pending',
            processingFees: fm.processingFees,
            collectionsFee: fm.collectionsFee,
            paysFees: fm.paysFees,
            productInfo: {
              productId: dataProduct.productId,
              productName: dataProduct.shortDescription
            },
            userInfo: {
              userId: body.userId,
              userName: body.userName,
            },
            beneficiaryInfo: {
              beneficiaryId: '',
              beneficiaryName: ''

            }



          });
        });









        return cb(null, result);
      },
    });


  })

}


module.exports = {

  createOrder: createOrder

}
