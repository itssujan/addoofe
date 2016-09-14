angular.module('app')
    .controller('ProductSelectorCtrl', [ '$scope','envService', '$state','Restangular', '$rootScope',
        'Auth','growl','$mixpanel','$filter','$cookieStore',
        function ($scope, envService, $state, Restangular, $rootScope, Auth, growl, $mixpanel, $filter, $cookieStore) {
            console.log('In ProductSelectorCtrl');
            $scope.product = "sharefile";
            $scope.products = [];

            if(Auth.user.role == 'superadmin') {
                Restangular.all("product").getList().then(function (data) {
                    $scope.products  = data;
                    $scope.productsMap = data.reduce(function(map, obj) {
                        map[obj._id] = obj;
                        return map;
                    }, {});

                });    
            } else {
                Restangular.one("user/"+Auth.user._id + "?populate=product").get().then(function (data) {
                    for(var i=0;i < data.products.length;i++){
                        var product = data.products[i];
                        $scope.products.push(Restangular.one("product",product).get().$object);
                        $scope.products.forEach(function(product) {
                            $scope.productsMap.product._id = product;
                        });

                    }
                });    
            }
            
            $scope.setProduct = function(){
                var selectedProduct = $scope.product
                var user = Auth.user;
                user.product = $scope.productsMap[selectedProduct].name;
                user.productID = selectedProduct;
                Auth.user = user;
                $cookieStore.put("user",Auth.user);
                $state.go('customer-manager.dashboard');    
            }
        } ]);