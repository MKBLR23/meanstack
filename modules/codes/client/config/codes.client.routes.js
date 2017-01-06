(function() {
    'use strict';
    angular.module('codes').config(routeConfig);
    routeConfig.$inject = ['$stateProvider'];

    function routeConfig($stateProvider) {
        $stateProvider.state('codes', {
            abstract: true,
            url: '/codes',
            template: '<ui-view/>'
        }).state('codes.list', {
            url: '',
            templateUrl: 'modules/codes/client/views/list-codes.client.view.html',
            controller: 'CodesListController',
            controllerAs: 'vm',
            data: {
                pageTitle: 'Codes List'
            }
        }).state('codes.create', {
            url: '/create',
            templateUrl: 'modules/codes/client/views/form-code.client.view.html',
            controller: 'CodesController',
            controllerAs: 'vm',
            resolve: {
                codeResolve: newCode
            },
            data: {
                roles: ['user', 'admin'],
                pageTitle: 'Codes Create'
            }
        }).state('codes.edit', {
            url: '/:codeId/edit',
            templateUrl: 'modules/codes/client/views/form-code.client.view.html',
            controller: 'CodesController',
            controllerAs: 'vm',
            resolve: {
                codeResolve: getCode
            },
            data: {
                roles: ['user', 'admin'],
                pageTitle: 'Edit Code {{ codeResolve.name }}'
            }
        }).state('codes.view', {
            url: '/:codeId',
            templateUrl: 'modules/codes/client/views/view-code.client.view.html',
            controller: 'CodesController',
            controllerAs: 'vm',
            resolve: {
                codeResolve: getCode
            },
            data: {
                pageTitle: 'Code {{ codeResolve.name }}'
            }
        });
    }
    getCode.$inject = ['$stateParams', 'CodesService'];

    function getCode($stateParams, CodesService) {
        return CodesService.get({
            codeId: $stateParams.codeId
        }).$promise;
    }
    newCode.$inject = ['CodesService'];

    function newCode(CodesService) {
        return new CodesService();
    }
}());