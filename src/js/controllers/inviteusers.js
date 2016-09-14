angular.module('app')
    .controller('InviteUsersCtrl', [ '$scope', '$state','Restangular', '$rootScope','$cookieStore',
        'growl','$location', '$mixpanel','$filter','Auth',
        function ($scope, $state, Restangular,$rootScope,$cookieStore, growl, $location, $mixpanel,$filter, Auth) {
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
				Restangular.all('inviteusers').post({"users":$scope.users}).then(function(data){
					growl.success("Invitation sent to the users successfully.");
				});
            }

            var getTeam = function() {
                Restangular.all('user?manager='+Auth.user._id).getList().then(function (data) {
                    $scope.reportees = data;
                    $scope.displayedReportees = [].concat($scope.reportees);
                });   
            }

            getTeam();

        } ]);
