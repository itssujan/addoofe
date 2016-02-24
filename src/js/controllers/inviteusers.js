angular.module('app')
    .controller('InviteUsersCtrl', [ '$scope', '$state','Restangular', '$rootScope','$cookieStore','growl','$location', '$mixpanel','$filter',
        function ($scope, $state, Restangular,$rootScope,$cookieStore, growl, $location, $mixpanel,$filter) {
            console.log('In Inviteusers controller');

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

            $scope.sendInvitation = function() {
            	console.log("Sending invites");
				Restangular.all('inviteusers').post($scope.users).then(function(data){
					
				});

            }

        } ]);
