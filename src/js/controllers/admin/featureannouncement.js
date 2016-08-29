angular.module('app')
    .controller('FeatureAnnouncementCtrl', ['$scope', 'envService', '$state', 'Restangular', '$rootScope',
        'Auth', 'growl', '$mixpanel', '$filter',
        function ($scope, envService, $state, Restangular, $rootScope, Auth, growl, $mixpanel, $filter) {
        	console.log('In FeatureAnnouncementCtrl');
        	$scope.onboarding = {};
        	$scope.onboarding.feature = {};
        	$scope.onboarding.feature.content = [];

        	$scope.save = function() {
                    console.log("Saving :"+JSON.stringify($scope.onboarding));
                    $scope.onboarding.onboardingType = "feature";
                    $scope.onboarding.feature.content[0].source = "external";
                    Restangular.all('onboardingsetup').post($scope.onboarding).then(function(data){
                        growl.success('Product saved..');
                    });
            }
        }]);
