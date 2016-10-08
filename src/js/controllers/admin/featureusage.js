angular.module('app')
    .controller('FeatureUsageCtrl', ['$scope', 'envService', '$state', 'Restangular', '$rootScope',
        'Auth', 'growl', '$mixpanel', '$filter',
        function ($scope, envService, $state, Restangular, $rootScope, Auth, growl, $mixpanel, $filter) {
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
