var _ = require('lodash');
var contactService = require('./contact.service');

exports.create = function(req, res, next) {
  contactService.create(req.body, function (err, data){
    if(err) res.json(402, err);
    res.json(200, data);
  });
};

exports.list = function(req, res, next) {
  var user = { userId: req.params.id };
  contactService.list(user, function (err, data){
    if(err) res.json(402, err);
    res.json(200, data);
  });
};

exports.load = function(req, res, next) {
  contactService.load(req.params,  function (err, data){
    if(err) res.json(402, err);
    res.json(200, data);
  });
};

exports.update = function(req, res, next) {
  contactService.update(req.body, function (err, data){
    if(err) res.json(402, err);
    res.json(200, data);
  });
};

// exports.delete = function(req, res, next) {
//   TDUserService.delete(req.body, function (data){
//     res.json(data);
//   });
// };