'use strict';

var userService = require('./user.service');
var User = require('./user.model');

exports.create = function(req, res) {
	//TODO
	/*
	/api/v1/loan/application/user/create POST
	request: applicationId, firstName, lastName, address, phone, email, dob, ssn
	response: true
	*/

	var user = new User(req.body);
	var isValidFirstName = userService.validateFirstNameSync(req.body.firstName);
	if(!isValidFirstName){
		return res.json(400, {
	  		"code": "ValidationError",
	  		"message": "First name is not accepted"
		});
	}

	var isValidLastName = userService.validateLastNameSync(req.body.lastName);
	if(!isValidLastName){
		return res.json(400, {
	  		"code": "ValidationError",
	  		"message": "Last name is not accepted"
		});
	}

	if(!req.body.ssn || !userService.verifySSN(user.ssn)){
		return res.json(400, {
	  		"code": "ValidationError",
	  		"message": "SSN is not valid"
		});
	}
	user.ssn = userService.encryptSSN(req.body.ssn);

	userService.save(user, function(err, data) {
    	if(err) return handleError(res, err);
    	return res.json(200, {userId : data._id});
  	});

};


exports.getUser = function(req, res, next) {
  if(!req.params.id){
  	return res.json(400, {
	      "code": "ValidationError",
	      "message": "User loan Id is required"
	    });
  }
  var filter = {_id:req.params.id};
  userService.findOne(filter, function(err, userLoan) {
    if(err) return handleError(res, err);
    if (!userLoan) return res.json(404,{
      "code": "ValidationError",
      "message": "User Id does not exist"
    });
    res.json(200,userLoan);
  });
};


function handleError(res, err) {
  var httpErrorCode = 500;
  var errors = [];

  if(err.name === "ValidationError") {
    httpErrorCode = 400;
  }

  return res.json(httpErrorCode, {code : err.name, message : err.message, errors : err.errors});
}