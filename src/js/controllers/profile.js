angular.module('app')
    .controller('ProfileController', [ '$scope','envService', '$state','Restangular', '$rootScope',
        'Auth','Upload','growl','$mixpanel','$stateParams',
        function ($scope,envService, $state, Restangular,$rootScope, Auth, Upload, growl, $mixpanel,$stateParams) {
            console.log('In ProfileController');

            $scope.auth = Auth;
            $scope.user = Auth.user;

            console.log("Manager Reqd :"+$stateParams.managerRequired);
            if($stateParams.managerRequired){
                $scope.managerRequired = true;
                Restangular.all("user?role=saleslead&product="+Auth.user.product).getList().then(function(data){
                    $scope.managers = data;
                });
            }


            $scope.updateProfile = function(){
                if($scope.avatarfile)
                    $scope.uploadAvatar();
                else
                    $scope.updateUser();
                $mixpanel.track('Updated Profile');

            }

            $scope.uploadAvatar = function () {
                Upload.upload({
                    url: envService.read('nodeserverurl')+'/upload',
                    data: {file: $scope.avatarfile, 'username': $scope.username}
                }).then(function (resp) {
                    console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data.uploadedPath);
                    growl.success('Avatar uploaded successfully!');
                    var avatarurl = resp.data.uploadedPath;
                    $scope.user.local.avatarurl = avatarurl;
                    console.log("Saving video course :"+JSON.stringify($scope.user));
                    $scope.updateUser();
                }, function (resp) {
                    console.log('Error status: ' + resp.status);
                    growl.error('Error...please try again!');
                }, function (evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                });
            };

            $scope.updateUser = function() {
                Restangular.one("user",$scope.user._id).get().then(function(data){
                    var updatedUser = data;
                    updatedUser.local.firstname = $scope.user.local.firstname;
                    updatedUser.local.lastname = $scope.user.local.lastname;
                    updatedUser.local.password = $scope.user.local.password;
                    updatedUser.local.avatarurl = $scope.user.local.avatarurl;
                    updatedUser.local.timetrade = $scope.user.local.timetrade;
                    updatedUser.email = $scope.user.local.email;
                    updatedUser.local.email = $scope.user.local.email;
                    updatedUser.local.newpassword = $scope.user.local.newpassword;
                    updatedUser.manager = $scope.user.manager;    
                    console.log("Test :" +$scope.user.manager);
                    updatedUser.put().then(function(){
                        $scope.managerRequired = false;
                        growl.success('Profile updated successfully..');
                    });
                });
            };

        } ]);
