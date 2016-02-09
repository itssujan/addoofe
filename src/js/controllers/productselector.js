angular.module('app')
    .controller('ProductSelectorCtrl', [ '$scope','envService', '$state','Restangular', '$rootScope',
        'Auth','growl','$mixpanel','$filter',
        function ($scope,envService, $state, Restangular,$rootScope, Auth, growl,$mixpanel,$filter) {
            console.log('In ProductSelectorCtrl');
            $scope.adminproduct = "sharefile";
            $scope.setProduct = function(){
            	Auth.user.product = $scope.adminproduct;
                Restangular.one("user",Auth.user._id).get().then(function(user){
                    user.product = Auth.user.product;
                    user.put();
                    $state.go('customer-manager.dashboard');
                });

            }
        } ]);