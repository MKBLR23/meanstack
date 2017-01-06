'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Code = mongoose.model('Code'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Code
 */
exports.create = function(req, res) {
  var code = new Code(req.body);
  code.user = req.user;

  code.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(code);
    }
  });
};

/**
 * Show the current Code
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var code = req.code ? req.code.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  code.isCurrentUserOwner = req.user && code.user && code.user._id.toString() === req.user._id.toString();

  res.jsonp(code);
};

/**
 * Update a Code
 */
exports.update = function(req, res) {
  var code = req.code;

  code = _.extend(code, req.body);

  code.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(code);
    }
  });
};

/**
 * Delete an Code
 */
exports.delete = function(req, res) {
  var code = req.code;

  code.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(code);
    }
  });
};

/**
 * List of Codes
 */
exports.list = function(req, res) {
  Code.find().sort('-created').populate('user', 'displayName').exec(function(err, codes) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(codes);
    }
  });
};

/**
 * Code middleware
 */
exports.codeByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Code is invalid'
    });
  }

  Code.findById(id).populate('user', 'displayName').exec(function (err, code) {
    if (err) {
      return next(err);
    } else if (!code) {
      return res.status(404).send({
        message: 'No Code with that identifier has been found'
      });
    }
    req.code = code;
    next();
  });
};
