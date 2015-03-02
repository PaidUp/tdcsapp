'use strict';

var _ = require('lodash');
var teamService = require('./team.service');
var Team = require('./team.model');
var mongoose = require('mongoose');

exports.create = function(req, res) {
  var team = new Team(req.body);
  teamService.save(team, function(err, data) {
    if(err) return handleError(res, err);
    return res.json(200, {teamId : data._id});
  });
};

// Get list of teams
exports.list = function(req, res, next) {
  teamService.find({},'-name -logo -info -city -state -country', function(err, teamFind) {
    if(err) return res.json(409,res, err);
    if(!teamFind){
      return res.json(404,{
        "code": "AuthCredentialNotExists",
        "message": "team does not exists"
      });
    }
    res.json(200, teamFind);
  });
};

exports.load = function(req, res, next) {
  if(!req.params && !req.params.id) {
    return res.json(400, {
      "code": "ValidationError",
      "message": "teamId is required"
    });
  }
  var teamId = mongoose.Types.ObjectId(req.params.id);
  var filter = {'_id':teamId};
  teamService.findOne(filter, function(err, teamFind) {
      if(err) return res.json(409,res, err);
      if(!teamFind){
        return res.json(404,{
          "code": "AuthCredentialNotExists",
          "message": "Team does not exists"
        });
      }
      return res.json(200,teamFind);
    }
  );
};

exports.update = function(req, res, next) {
  var teamId = mongoose.Types.ObjectId(req.params.id);
  var filter = {'_id':teamId};
  teamService.findOne(filter, function(err, teamFind) {
      if(err) return res.json(409,res, err);
      if(!teamFind){
        return res.json(404,{
          "code": "AuthCredentialNotExists",
          "message": "Team does not exists"
        });
      }
      teamService.update(filter, req.body,function(err,data){
        if(err) return handleError(res, err);
        return res.send(200);  
      });
      
    }
  );
};

exports.delete = function(req, res, next) {
  if(!req.params && !req.params.id) {
    return res.json(400, {
      "code": "ValidationError",
      "message": "teamId is required"
    });
  }
  var teamId = mongoose.Types.ObjectId(req.params.id);
  var filter = {'_id':teamId};
  teamService.findOne(filter, function(err, teamFind) {
      if(err) return res.json(409,res, err);
      if(!teamFind){
        return res.json(404,{
          "code": "AuthCredentialNotExists",
          "message": "team does not exists"
        });
      }
      teamService.remove(filter,function(err,data){
        if(err) return handleError(res, err);
        return res.send(200);  
      });
      
    }
  );
};

function handleError(res, err) {
  return res.send(500, err);
}