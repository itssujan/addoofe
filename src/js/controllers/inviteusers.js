angular.module('app')
    .controller('InviteUsersCtrl', [ '$scope', '$state','Restangular', '$rootScope','$cookieStore','growl','$location', '$mixpanel','$filter',
        function ($scope, $state, Restangular,$rootScope,$cookieStore, growl, $location, $mixpanel,$filter) {
            console.log('In Inviteusers controller');

            $scope.user = {};
            $scope.$state = $state;

            $scope.users = [];
            $scope.users.push({"email":""});
            $scope.users.push({"email":""});
            $scope.users.push({"email":""});
            $scope.users.push({"email":""});
            $scope.users.push({"email":""});
            $scope.users.push({"email":""});

            $scope.addMoreUsers = function() {
            	$scope.users.push({"email":""});
            	$scope.users.push({"email":""});
            }

        } ]);
