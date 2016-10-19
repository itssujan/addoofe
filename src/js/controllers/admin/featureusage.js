angular.module('app')
    .controller('FeatureUsageCtrl', ['$scope', 'envService', '$state', 'Restangular', '$rootScope',
        'Auth', 'growl', '$mixpanel', '$filter','$stateParams',
        function ($scope, envService, $state, Restangular, $rootScope, Auth, growl, $mixpanel, $filter,$stateParams) {
 
            $scope.featureID = $stateParams.featureID;
            $scope.faUserStats = {};

            Restangular.all("fauserstats?product="+Auth.user.product).getList().then(function (data) {
                var data1 = [];
                for(var i=0; i < 7 && data[i]; i++) {
                    $scope.labels.push(data[i].date.month+"/"+data[i].date.day+"/"+data[i].date.year);
                    data1.push(data[i].count);
                }
                $scope.labels.reverse();
                data1 = data1.reverse();
                $scope.data.push(data1);
                if(data && data.length > 0) {
                    $scope.loading = false;
                }
             });


        	console.log('In FeatureUsageCtrl ');
        	Restangular.all("onboardingsetup?onboardingType=feature&product=" + Auth.user.productID).getList().then(function (data) {
        		$scope.featureonboarding = data;
        		$scope.displayedFeatureonboarding = [].concat($scope.featureonboarding);
        	});

            Restangular.all("onboardingsetup?onboardingType=training&product=" + Auth.user.productID).getList().then(function (data) {
                $scope.onboarding = data;
                $scope.displayedOnboarding = [].concat($scope.onboarding);
            });
        }]);
