angular.module('app')
    .controller('OnboardingConfigCtrl', ['$scope', 'envService', '$state', 'Restangular', '$rootScope',
        'Auth', 'growl', '$mixpanel', '$filter','$uibModal',
        function ($scope, envService, $state, Restangular, $rootScope, Auth, growl, $mixpanel, $filter, $uibModal) {
        	console.log('In OnboardingConfigCtrl');

            $scope.onboarding = {};

            Restangular.all("course?product=" + Auth.user.product + "&baseTrack=true&author=" + Auth.user._id).getList().then(function (data) {
                $scope.courses = data;
                $scope.displayedCourses = [].concat($scope.courses);
            });

            var getProduct = function() {
                Restangular.one('product?name='+Auth.user.product).get().then(function (product) {
                    $scope.product = product[0];
                });
            }   

            $scope.openTrackListModal = function () {
                $scope.trackModalInstance = $uibModal.open({
                  animation     : true,
                  templateUrl   : 'templates/modals/TrackListModal.html',
                  scope         : $scope
                });
            };

            $scope.closeTrackListModal = function () {
                $scope.trackModalInstance.dismiss('cancel');
            };

            $scope.addTrack = function() {
                console.log("Trying to add to track");
                angular.forEach($scope.courses, function(value, key) {
                  if(value.selected == true) {
                    console.log("Setting value..");
                    if(!$scope.onboarding.training) {
                        $scope.onboarding.training = {};
                    }
                    console.log("Here");
                    $scope.onboarding.training.courseTitle = value.title;
                    $scope.onboarding.training.courseID = value._id;
                    console.log("Here22");
                  }
                });    
                console.log("Here 33");
                $scope.closeTrackListModal();            
            }

            $scope.save = function() {
                console.log("Saving :"+JSON.stringify($scope.onboarding));
                $scope.onboarding.onboardingType = "training";
                $scope.onboarding.product = $scope.product._id;
                console.log("Saving :"+JSON.stringify($scope.onboarding));
                Restangular.all('onboardingsetup').post($scope.onboarding).then(function(data){
                    growl.success('Product saved..');
                });
            }

            getProduct();

        }]);
