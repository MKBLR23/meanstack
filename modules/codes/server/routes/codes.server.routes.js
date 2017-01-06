'use strict';

/**
 * Module dependencies
 */
var codesPolicy = require('../policies/codes.server.policy'),
  codes = require('../controllers/codes.server.controller');

module.exports = function(app) {
  // Codes Routes
  app.route('/api/codes').all(codesPolicy.isAllowed)
    .get(codes.list)
    .post(codes.create);

  app.route('/api/codes/:codeId').all(codesPolicy.isAllowed)
    .get(codes.read)
    .put(codes.update)
    .delete(codes.delete);

  // Finish by binding the Code middleware
  app.param('codeId', codes.codeByID);
};
