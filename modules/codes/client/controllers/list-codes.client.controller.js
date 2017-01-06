(function () {
  'use strict';

  angular
    .module('codes')
    .controller('CodesListController', CodesListController);

  CodesListController.$inject = ['CodesService'];

  function CodesListController(CodesService) {
    var vm = this;

    vm.codes = CodesService.query();
  }
}());
