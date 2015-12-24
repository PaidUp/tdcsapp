'use strict'

var tdPaymentPlanService = require('TDCore').paymentPlanService;
var config = require('../../../config/environment/index');
var logger = require('../../../config/logger');

function createPaymentPlanFull(params, cb){


  let paymentPlan = {
    name : params.orderId,
    destination : params.destinationId
  }

  let metadatas = [
    {name : 'org_name' , value : params.meta.org_name},
    {name : 'sku' , value : params.meta.sku},
    {name : 'athlete_first_name' , value : params.meta.athlete_first_name},
    {name : 'athlete_first_last' , value : params.meta.athlete_last_name}
  ]

  let schedules = [];

  //{schedule_data : {name : params.name, informations : []}}

  params.schedulePeriods.forEach(function (ele, idx, arr) {
    /*let attr = {
      id : ele.id,
      nextPayment : ele.nextPayment,
      nextPaymentDue : ele.nextPaymentDue,
      price : ele.price,
      percent : ele.percent,
      fee : ele.fee,
      feePercent : ele.feePercent,
      description : ele.description,
      discountToFee : ele.discountToFee
    };*/
    let period = {name  : params.name,
      informations : []
    };

    for(var attributeName in ele){
      let scheduleInf = {
        name : attributeName,
        value : ele[attributeName]
      }

      period.informations.push(scheduleInf);
    }
    schedules.push(period);
  });

  paymentPlan.schedules = schedules;

  paymentPlan.metadatas = metadatas;

  logger.debug('payment plan' , JSON.stringify(paymentPlan));

  tdPaymentPlanService.paymentPlanCreateFull(paymentPlan, function(err, data){
    if(err){
      logger.error('tdPaymentPlanService.paymentPlanCreateFull', err);
      return cb(err);
    }
    logger.debug('tdPaymentPlanService.paymentPlanCreateFull' , data);
    cb(null, data);
  });
};

function paymentPlanInfoFullByName(name, isParse, cb){
  tdPaymentPlanService.paymentPlanInfoFullByName(name, isParse, function (err , data){
    if(err){
      logger.error('tdPaymentPlanService.getPaymentPlanFull', err);
      return cb(err);
    }else{
      logger.debug('tdPaymentPlanService.getPaymentPlanFull', data);
      return cb(null, data);
    }
  });
};

module.exports = function(conf){
  if(conf){
    logger.debug('set new configuration' , conf);
    config = conf;
  }
  tdPaymentPlanService.init(config.connections.schedule);

  return {
    createPaymentPlanFull:createPaymentPlanFull,
    paymentPlanInfoFullByName:paymentPlanInfoFullByName
  }
}
