angular.module('app')
    .controller('ViewProductsCtrl', [ '$scope', '$state','Restangular', '$rootScope','$cookieStore','growl',
        '$location', '$mixpanel','$filter','Auth',
        function ($scope, $state, Restangular,$rootScope,$cookieStore, growl, $location, $mixpanel,$filter,Auth) {
            console.log('In ViewProducts controller');
            $scope.loading = true;
            // Get Content..
            Restangular.all("product").getList().then(function (data) {
                console.log("Products count :"+data.length);
                $scope.products = data;
                $scope.displayProducts = [].concat($scope.videos);
                $scope.loading = false;
            });

        } ]);