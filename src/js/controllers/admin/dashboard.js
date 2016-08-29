angular.module('app')
    .controller('AdminDashboardCtrl', ['$scope', 'envService', '$state', 'Restangular', '$rootScope',
        'Auth', 'growl', '$mixpanel', '$filter',
        function ($scope, envService, $state, Restangular, $rootScope, Auth, growl, $mixpanel, $filter) {
        	console.log('In AdminDashboardCtrl :'+Auth.user.productID);
        	Restangular.all("onboardingsetup?onboardingType=feature&product=" + Auth.user.productID).getList().then(function (data) {
        		console.log("data");
        		console.log(data);
        		$scope.featureonboarding = data;
        		$scope.displayedFeatureonboarding = [].concat($scope.featureonboarding);
        	});
        }]);
