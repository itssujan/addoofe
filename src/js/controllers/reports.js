angular.module('app')
    .controller('ReportsCtrl', [ '$scope', '$state','Restangular', '$rootScope','$cookieStore','growl',
        '$location', '$mixpanel','$filter','Auth',
        function ($scope, $state, Restangular,$rootScope,$cookieStore, growl, $location, $mixpanel,$filter,Auth) {
            console.log('In Reports controller');

             Restangular.all("reports?product="+Auth.user.product).getList().then(function (data) {
                $scope.report = data[0];
            });

              Restangular.all("topvideos").getList().then(function (data) {
                $scope.topvideos = data;
            });

              
        } ]);