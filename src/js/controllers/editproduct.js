angular.module('app')
    .controller('EditProductCtrl', [ '$scope', '$state','Restangular', '$rootScope','$cookieStore','growl',
        '$location', '$mixpanel','$filter','Auth','$stateParams',
        function ($scope, $state, Restangular,$rootScope,$cookieStore, growl, $location, $mixpanel,$filter,Auth,$stateParams) {
            console.log('In EditProduct controller');

            $scope.productID  = $stateParams.productID;
            console.log("Prodct ID :"+$scope.productID);
            $scope.newProduct = false;
            if(!$scope.productID) {
                console.log("New product");
                $scope.newProduct = true;
                $scope.product = {};
            } else {
                Restangular.one("product",$scope.productID).get().then(function (data) {
                    $scope.product = data;
                });

            }
                       
            $scope.save = function() {
                if($scope.newProduct) {
                    console.log("Saving :"+JSON.stringify($scope.product));
                    Restangular.all('product').post($scope.product).then(function(data){
                        growl.success('Product saved..');
                    });
                } else {
                    $scope.product.put();
                    growl.success('Product updated..');
                }
            }

        } ]);