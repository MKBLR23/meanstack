// Codes service used to communicate Codes REST endpoints
(function () {
  'use strict';

  angular
    .module('codes')
    .factory('CodesService', CodesService);

  CodesService.$inject = ['$resource'];

  function CodesService($resource) {
    return $resource('api/codes/:codeId', {
      codeId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
