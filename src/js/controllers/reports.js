angular.module('app')
    .controller('ReportsCtrl', [ '$scope', '$state','Restangular', '$rootScope','$cookieStore','growl',
        '$location', '$mixpanel','$filter','Auth',
        function ($scope, $state, Restangular,$rootScope,$cookieStore, growl, $location, $mixpanel,$filter,Auth) {
            console.log('In Reports controller');
        } ]);