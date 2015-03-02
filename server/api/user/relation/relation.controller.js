var _ = require('lodash');
var Relation = require('./relation.model');
var relationService = require('./relation.service');

exports.create = function(req, res, next) {
	relation = new Relation(req.body);
	relationService.save(relation, function(err, data) {
    	if(err) return handleError(res, err);
 		return res.send(200);
  	});
};

exports.list = function(req, res, next) {
  var userId = req.user._id;
  var filter = {sourceUserId:userId};
  relationService.find(filter,'-sourceUserId -_id -__v', function(err, relationFind) {
    if(err) return res.json(409,res, err);
    if(!relationFind){
      return res.json(404,{
        "code": "AuthCredentialNotExists",
        "message": "User Id does not exist"
      });
    }
    res.json(200, relationFind);
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