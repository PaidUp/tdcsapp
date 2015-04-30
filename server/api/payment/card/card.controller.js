'use strict'

var userService = require('../../user/user.service');
var paymentService = require('../payment.service');
//var cardService = require('./card.service');
var camelize = require('camelize');

exports.associate = function (req, res) {

  if(!req.body || !req.body.cardId){
    return res.json(400, {
        "code": "ValidationError",
        "message": "Card id is missing"
      });
  }
  var cardId = req.body.cardId;
  var filter= {_id:req.user._id};
  userService.find(filter,function(err, dataUser){
    if(err){
      return handleError(res, err);
    }
    paymentService.prepareUser(dataUser[0], function(err, userPrepared){
      if(!userPrepared.meta.TDPaymentId){
      return res.json(400, {
          "code": "ValidationError",
          "message": "user without TDPaymentId"
        });
      }

      paymentService.associateCard(userPrepared.meta.TDPaymentId, cardId, function(err, dataAssociate){
        if(err){
          return handleError(res, err);
        }
          return res.json(200, dataAssociate);
      });
    });
  });
};

exports.listCards = function(req, res){
  var filter= {_id:req.user._id};
  userService.find(filter,function(err, dataUser){
    if(err){
      return handleError(res, err);
    }
    paymentService.prepareUser(dataUser[0], function(err, userPrepared){
      if(!userPrepared.meta.TDPaymentId){
        return res.json(400,{
              "code": "ValidationError",
              "message": "user without TDPaymentId"
        });
      }
      paymentService.listCards(userPrepared.meta.TDPaymentId, function(err, dataCards){
        if(err){
          return res.json(400,{
            "code": "ValidationError",
              "message": "Card is not valid"
          });
        }
        if(!dataCards){
          return res.json(400,{
            "code": "ValidationError",
              "message": "User without cards"
          });
        }
        return res.json(200, camelize(dataCards));
      });
    });
  });
}

exports.getCard = function(req, res){
	if(!req.params.id){
		return res.json({
			"code": "ValidationError",
	        "message": "Card number is required"
		});
	}
	var filter= {_id:req.user._id};
  	userService.find(filter,function(err, dataUser){
    	if(err){
	      	return handleError(res, err);
	    }
	    paymentService.prepareUser(dataUser[0], function(err, userPrepared){
	      	if(!userPrepared.meta.TDPaymentId){
	        	return res.json(400,{
	            	"code": "ValidationError",
	            	"message": "User without TDPaymentId"
	    		});
			}

			paymentService.fetchCard(req.params.id, function(err, dataCard){
				if(err){
				 	return res.json(400,{
		            	"code": "ValidationError",
		              	"message": "Card is not valid"
		          	});
				}
				if(!dataCard){
					return res.json(400,{
            			"code": "ValidationError",
              			"message": "User without Card"
          			});
				}
				return res.json(200, camelize(dataCard));
			});

		});
	});
}

function handleError(res, err) {
  var httpErrorCode = 500;
  var errors = [];

  if (err.name === "ValidationError") {
    httpErrorCode = 400;
  }

  return res.json(httpErrorCode, {
    code: err.name,
    message: err.message,
    errors: err.errors
  });
}
