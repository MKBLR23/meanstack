(function () {
  'use strict';

  // Codes controller
  angular
    .module('codes')
    .controller('CodesController', CodesController);

  CodesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'codeResolve'];

  function CodesController ($scope, $state, $window, Authentication, code) {
    var vm = this;

    vm.authentication = Authentication;
    vm.code = code;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Code
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.code.$remove($state.go('codes.list'));
      }
    }

    // Save Code
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.codeForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.code._id) {
        vm.code.$update(successCallback, errorCallback);
      } else {
        vm.code.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('codes.view', {
          codeId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
