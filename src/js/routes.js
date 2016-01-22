'use strict';

/**
 * Route configuration for the RDash module.
 */
angular.module('app').config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {

        // For unmatched routes
        $urlRouterProvider.otherwise('/');

        // Application routes
        $stateProvider
            .state('index', {
                url: '/',
                templateUrl: 'templates/login.html'
            })
            .state('dashboard', {
                url: '/dashboard',
                templateUrl: 'templates/dashboard.html'
            })
            .state('trackbuilder', {
                url: '/trackbuilder',
                templateUrl: 'templates/trackbuilder.html'
            })
            .state('clientdashboard', {
                url: '/clientdashboard',
                templateUrl: 'templates/client/dashboard.html'
            });

    }
]);