'use strict';

var userService = require('./user.service');

exports.create = function(req, res) {
	userService.create(req.body, function (err, data){
    if(err) res.json(402, err);
    res.json(200, data);
  });
};


// exports.getUser = function(req, res, next) {
//   if(!req.params.id){
//   	return res.json(400, {
// 	      "code": "ValidationError",
// 	      "message": "User loan Id is required"
// 	    });
//   }
//   var filter = {_id:req.params.id};
//   userService.findOne(filter, function(err, userLoan) {
//     if(err) return handleError(res, err);
//     if (!userLoan) return res.json(404,{
//       "code": "ValidationError",
//       "message": "User Id does not exist"
//     });
//     res.json(200,userLoan);
//   });
// };


// function handleError(res, err) {
//   var httpErrorCode = 500;
//   var errors = [];

//   if(err.name === "ValidationError") {
//     httpErrorCode = 400;
//   }

//   return res.json(httpErrorCode, {code : err.name, message : err.message, errors : err.errors});
// }