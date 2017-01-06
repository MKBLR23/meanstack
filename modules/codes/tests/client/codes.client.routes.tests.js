(function () {
  'use strict';

  describe('Codes Route Tests', function () {
    // Initialize global variables
    var $scope,
      CodesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _CodesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      CodesService = _CodesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('codes');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/codes');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          CodesController,
          mockCode;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('codes.view');
          $templateCache.put('modules/codes/client/views/view-code.client.view.html', '');

          // create mock Code
          mockCode = new CodesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Code Name'
          });

          // Initialize Controller
          CodesController = $controller('CodesController as vm', {
            $scope: $scope,
            codeResolve: mockCode
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:codeId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.codeResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            codeId: 1
          })).toEqual('/codes/1');
        }));

        it('should attach an Code to the controller scope', function () {
          expect($scope.vm.code._id).toBe(mockCode._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/codes/client/views/view-code.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          CodesController,
          mockCode;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('codes.create');
          $templateCache.put('modules/codes/client/views/form-code.client.view.html', '');

          // create mock Code
          mockCode = new CodesService();

          // Initialize Controller
          CodesController = $controller('CodesController as vm', {
            $scope: $scope,
            codeResolve: mockCode
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.codeResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/codes/create');
        }));

        it('should attach an Code to the controller scope', function () {
          expect($scope.vm.code._id).toBe(mockCode._id);
          expect($scope.vm.code._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/codes/client/views/form-code.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          CodesController,
          mockCode;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('codes.edit');
          $templateCache.put('modules/codes/client/views/form-code.client.view.html', '');

          // create mock Code
          mockCode = new CodesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Code Name'
          });

          // Initialize Controller
          CodesController = $controller('CodesController as vm', {
            $scope: $scope,
            codeResolve: mockCode
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:codeId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.codeResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            codeId: 1
          })).toEqual('/codes/1/edit');
        }));

        it('should attach an Code to the controller scope', function () {
          expect($scope.vm.code._id).toBe(mockCode._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/codes/client/views/form-code.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
