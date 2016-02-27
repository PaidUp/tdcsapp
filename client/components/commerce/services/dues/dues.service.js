'use strict';

angular.module('convenienceApp')
  .service('DuesService', function ($cookieStore, $q, $resource, $rootScope) {

    var generateDues = $resource('/api/v1/commerce/dues/generate', {}, {});


    /**
     *
     * @param feeManagment
     * @returns {*|Function|promise|n}
     *
     * {
         "processingFees": {
            "cardFee" : "",
            "cardFeeActual" : "",
            "cardFeeFlat" : "",
            "cardFeeFlatActual" : "",
            "achFee" : "",
            "achFeeActual" : "",
            "achFeeFlat" : "",
            "achFeeFlatActual" : ""
        },
          "collectionsFee" : {
            "fee" : "",
            "feeFlat" : ""
        },
          "paysFees" : {
            "processing" : "true | false",
            "collections" : "true | false"
        },
        "dues" : [
            {
              "dateChage", "MM/dd/yyyy HH:mm",
              "amount" : "1000",
              "discount" : "0",
              "applyDiscount" : "false"
            }
          ]

      }
     *
     */

    this.generateDues = function(feeManagement, cb){
      generateDues.save(feeManagement).$promise.then(function(dues){
        cb(null, dues.data);
      }).catch(function(err){
        cb(err.data);
      });
    };



  });
