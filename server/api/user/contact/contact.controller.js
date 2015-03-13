var _ = require('lodash');
var contactService = require('./contact.service');

exports.create = function(req, res, next) {
  contactService.create(req.body, function (data){
    res.json(data);
  });
};

exports.list = function(req, res, next) {
  var user = { userId: req.params.id };
  contactService.list(user, function (data){
    res.json(data);
  });
};

exports.load = function(req, res, next) {
  contactService.load(req.params,  function (data){
    res.json(data);
  });
};

exports.update = function(req, res, next) {
  contactService.update(req.body, function (data){
    res.json(data);
  });
};

// exports.delete = function(req, res, next) {
//   TDUserService.delete(req.body, function (data){
//     res.json(data);
//   });
// };