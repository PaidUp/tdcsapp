var _ = require('lodash');
var Contact = require('./contact.model');
var contactService = require('./contact.service');
var userService = require('../user.service');
var mongoose = require('mongoose');
var User = require('../user.model');

exports.create = function(req, res, next) {
  var userId = req.user._id;
  var idContact = mongoose.Types.ObjectId();
  var userUpdate = req.body.userId;
  var isValidTypeContact = contactService.validateTypeContactSync(req.body.type);
  if(!isValidTypeContact){
    return res.json(400, {
      "code": "ValidationError",
      "message": "Contact Type is not accepted"
    });
  }
  var filter = userId;
  if(userUpdate != userId) {
    filter = {createdBy : userId, _id:userUpdate};
  }
  userService.findOne(filter, function(err, userFind) {
    if(err) return res.json(409,res, err);
    if(!userFind){
      return res.json(404,{
        "code": "AuthCredentialNotExists",
        "message": "User Id does not exist"
      });
    }
    var contacts = {
      contactId : idContact,
      label : req.body.label,
      type : req.body.type,
      value : req.body.value
    };
    userFind.contacts.push(contacts);
    userService.save(userFind, function(err, userSave) {
      if(err) return handleError(res, err);
      res.send(200, {contactId:idContact});
    });
  });
};

exports.list = function(req, res, next) {
  var userId = req.user._id;
  var userUpdate = req.params.id;
  var filter = userId;
  if(userUpdate != userId) {
    filter = userUpdate;
  }
  contactService.findOneFilter({_id:filter},'-contacts.label -contacts.value', function(err, userFind) {
    if(err) return res.json(409,res, err);
    if(!userFind || filter != userFind.id){
      return res.json(404,{
        "code": "AuthCredentialNotExists",
        "message": "User contact id does not exist"
      });
    }
    res.json(200, userFind.contacts);
  });
};

exports.load = function(req, res, next) {
  var userId = req.user._id;
  if(!req.params && !req.params.id) {
    return res.json(400, {
      "code": "ValidationError",
      "message": "Contact Id is required"
    });
  }
  var idContact = mongoose.Types.ObjectId(req.params.id);
  var filter = {'contacts.contactId':idContact};
  contactService.findOneFilter(filter,{contacts: {$elemMatch: {'contactId': idContact}}}, function(err, userFind) {
      if(err) return res.json(409,res, err);
      if(!userFind){
        return res.json(404,{
          "code": "AuthCredentialNotExists",
          "message": "Telephone does not exist"
        });
      }
      return res.json(200,userFind.contacts[0]);
    }
  );
};

exports.update = function(req, res, next) {
  var userId = req.user._id;
  var userUpdate = req.body.userId;
  if(!req.params && !req.params.id) {
    return res.json(400, {
      "code": "ValidationError",
      "message": "Contact Id is required"
    });
  }
  var contacts = mongoose.Types.ObjectId(req.params.id);
  var filter = {'contacts.contactId':contacts};
  if(userUpdate != userId) {
    filter = {createdBy : userId, _id:userUpdate,'contacts.contactId':contacts};
  }

  userService.findOne(filter, function(err, userFind) {
      if(err) return res.json(409,res, err);
      if(!userFind){
        return res.json(404,{
          "code": "AuthCredentialNotExists",
          "message": "Telephone does not exist"
        });
      }
      User.update(filter, {'$set': {'contacts.$.value': req.body.value}}, function(err, data){
        if(err) return handleError(res, err);
        res.send(200, {contactId:contacts});
      });
    }
  );
};

exports.delete = function(req, res, next) {
  var userId = req.user._id;
  if(!req.params && !req.params.id) {
    return res.json(400, {
      "code": "ValidationError",
      "message": "Contact Id is required"
    });
  }
  var contactId = mongoose.Types.ObjectId(req.params.id);
  var filter = {'contacts.contactId':contactId};
  User.findOne(filter,{contacts: {$elemMatch: {'contactId': contactId}}}, function(err, userFind) {
      if(err) return res.json(409,res, err);
      if(!userFind){
        return res.json(404,{
          "code": "AuthCredentialNotExists",
          "message": "Contact does not exists"
        });
      }
      User.update(filter, { $pull: { "contacts" : { 'contactId': contactId} } },function(err,data){
        if(err) return handleError(res, err);
        return res.send(200);  
      });
      
    }
  );
};