(function () {
  'use strict';

  describe('Codes Controller Tests', function () {
    // Initialize global variables
    var CodesController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      CodesService,
      mockCode;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _CodesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      CodesService = _CodesService_;

      // create mock Code
      mockCode = new CodesService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Code Name'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Codes controller.
      CodesController = $controller('CodesController as vm', {
        $scope: $scope,
        codeResolve: {}
      });

      // Spy on state go
      spyOn($state, 'go');
    }));

    describe('vm.save() as create', function () {
      var sampleCodePostData;

      beforeEach(function () {
        // Create a sample Code object
        sampleCodePostData = new CodesService({
          name: 'Code Name'
        });

        $scope.vm.code = sampleCodePostData;
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (CodesService) {
        // Set POST response
        $httpBackend.expectPOST('api/codes', sampleCodePostData).respond(mockCode);

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL redirection after the Code was created
        expect($state.go).toHaveBeenCalledWith('codes.view', {
          codeId: mockCode._id
        });
      }));

      it('should set $scope.vm.error if error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/codes', sampleCodePostData).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      });
    });

    describe('vm.save() as update', function () {
      beforeEach(function () {
        // Mock Code in $scope
        $scope.vm.code = mockCode;
      });

      it('should update a valid Code', inject(function (CodesService) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/codes\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($state.go).toHaveBeenCalledWith('codes.view', {
          codeId: mockCode._id
        });
      }));

      it('should set $scope.vm.error if error', inject(function (CodesService) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/codes\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      }));
    });

    describe('vm.remove()', function () {
      beforeEach(function () {
        // Setup Codes
        $scope.vm.code = mockCode;
      });

      it('should delete the Code and redirect to Codes', function () {
        // Return true on confirm message
        spyOn(window, 'confirm').and.returnValue(true);

        $httpBackend.expectDELETE(/api\/codes\/([0-9a-fA-F]{24})$/).respond(204);

        $scope.vm.remove();
        $httpBackend.flush();

        expect($state.go).toHaveBeenCalledWith('codes.list');
      });

      it('should should not delete the Code and not redirect', function () {
        // Return false on confirm message
        spyOn(window, 'confirm').and.returnValue(false);

        $scope.vm.remove();

        expect($state.go).not.toHaveBeenCalled();
      });
    });
  });
}());
