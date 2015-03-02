var _ = require('lodash');
var Contact = require('./address.model');
var addressService = require('./address.service');
var userService = require('../user.service');
var mongoose = require('mongoose');
var User = require('../user.model');

exports.create = function(req, res, next) {
  var addressId = mongoose.Types.ObjectId();
  var userUpdate = req.body.userId;
  var isValidTypeAddress = addressService.validateTypeAddressSync(req.body.type);
  if(!isValidTypeAddress){
    return res.json(400, {
      "code": "ValidationError",
      "message": "Type address is not accepted"
    });
  }

  var isValidCity = userService.validateOnlyLetterSync(req.body.city);
  var isValidState = userService.validateOnlyLetterSync(req.body.state);
  if(!isValidCity || !isValidState){
    return res.json(400, {
      "code": "ValidationError",
      "message": "State or City is not accepted"
    });
  }

  var filter = {_id:userUpdate};
  userService.findOne(filter, function(err, userFind) {
    if(err) return res.json(409,res, err);
    if(!userFind){
      return res.json(404,{
        "code": "AuthCredentialNotExists",
        "message": "User Id does not exist"
      });
    }
    var addresses = {
      addressId : addressId,
      type: req.body.type,
      label : req.body.label,
      address1 : req.body.address1,
      address2 : req.body.address2,
      city : req.body.city,
      state : req.body.state,
      country : req.body.country,
      zipCode : req.body.zipCode
    };
    userFind.addresses.push(addresses);
    userService.save(userFind, function(err, userSave) {
      if(err) return handleError(res, err);
      res.send(200, {addressId:addressId});
    });
  });
};

exports.list = function(req, res, next) {
  var userId = req.user._id;
  userService.findOneFilter(userId,'-addresses.address1 -addresses.address2 -addresses.label -addresses.value -addresses.address -addresses.city -addresses.state -addresses.country -addresses.zipCode', function(err, userFind) {
    if(err) return res.json(409,res, err);
    if(!userFind){
      return res.json(404,{
        "code": "AuthCredentialNotExists",
        "message": "User Id does not exist"
      });
    }
    res.json(200, userFind.addresses);
  });
};

exports.load = function(req, res, next) {
  var userId = req.user._id;
  if(!req.params && !req.params.id) {
    return res.json(400, {
      "code": "ValidationError",
      "message": "Address Id is required"
    });
  }
  var addressId = mongoose.Types.ObjectId(req.params.id);
  var filter = {'addresses.addressId':addressId};
  User.findOne(filter,{addresses: {$elemMatch: {'addressId': addressId}}}, function(err, userFind) {
      if(err) return res.json(409,res, err);
      if(!userFind){
        return res.json(404,{
          "code": "AuthCredentialNotExists",
          "message": "Address does not exist"
        });
      }
      return res.json(200,userFind.addresses[0]);
    }
  );
};

exports.update = function(req, res, next) {
  var userId = req.user._id;
  if(!req.params && !req.params.id) {
    return res.json(400, {
      "code": "ValidationError",
      "message": "Address Id is required"
    });
  }
  var addressId = mongoose.Types.ObjectId(req.params.id);
  var filter = {'addresses.addressId':addressId};
  User.findOne(filter, function(err, userFind) {
      if(err) return res.json(409,res, err);
      if(!userFind){
        return res.json(404,{
          "code": "AuthCredentialNotExists",
          "message": "Address does not exist"
        });
      }
      User.update(filter, {'$set': 
        { 'addresses.$.label': req.body.label,
          'addresses.$.address1': req.body.address1,
          'addresses.$.address2': req.body.address2,
          'addresses.$.city': req.body.city,
          'addresses.$.state': req.body.state,
          'addresses.$.country': req.body.country,
          'addresses.$.zipCode': req.body.zipCode
        }}, function(err, data){
        if(err) return handleError(res, err);
        res.send(200, {addressId:addressId});
      });
    }
  );
};

exports.delete = function(req, res, next) {
  var userId = req.user._id;
  if(!req.params && !req.params.id) {
    return res.json(400, {
      "code": "ValidationError",
      "message": "Address Id is required"
    });
  }
  var addressId = mongoose.Types.ObjectId(req.params.id);
  var filter = {'addresses.addressId':addressId};
  User.findOne(filter,{addresses: {$elemMatch: {'addressId': addressId}}}, function(err, userFind) {
      if(err) return res.json(409,res, err);
      if(!userFind){
        return res.json(404,{
          "code": "AuthCredentialNotExists",
          "message": "Address does not exist"
        });
      }
      User.update(filter, { $pull: { "addresses" : { 'addressId': addressId} } },function(err,data){
        if(err) return handleError(res, err);
        return res.send(200);  
      });
      
    }
  );
};