angular.module('app')
    .controller('ForgotPasswordCtrl', [ '$scope', '$state','Restangular', '$rootScope','$cookieStore','growl',
        '$location', '$mixpanel','$filter','$stateParams',
        function ($scope, $state, Restangular,$rootScope,$cookieStore, growl, $location, $mixpanel,$filter,$stateParams) {
            console.log('In Inviteusers controller');

            $scope.$state = $state;
            $scope.resetcode = $stateParams.resetcode;
            $scope.email = "";
            $scope.password = "";
            $scope.confirmpassword = "";

            if($scope.resetcode) {
                $mixpanel.track('Visit to reset password page');
                Restangular.all("passwordreset?resetCode="+$scope.resetcode).getList().then(function (data) {
                    if(data && !data[0].isActive) {
                        $scope.invalidcode = true;
                    }
                });
            }

            $scope.forgotPassword = function() {
            	$mixpanel.track('Forgot password request');
                console.log("Forgot password");
				Restangular.all('forgotpassword').post({"email":$scope.email}).then(function(data){
					growl.success("An email has been sent to "+$scope.email+".To finish resetting your password, follow the instructions in the email.");
				},function(response) {
                    if(response.status == 404) {
                        growl.error("Error : Please contact hello@addoo.io"); 
                    }
                });
            }

            $scope.resetpassword = function() {
                $mixpanel.track('Resetting password');
                if(validatePassword()) {
                    var resetparams = {};
                    resetparams.password = $scope.password;
                    resetparams.resetcode = $scope.resetcode;
                    Restangular.all('resetpwd').post({"resetparams":resetparams}).then(function(data){
                        growl.success("Password reset successfully. Click here to login");
                        $scope.passwordResetSuccess = true;
                    });
                } else {
                   growl.error("Passwords donot match, please verify"); 
                }
            }

            var validatePassword = function() {
                if($scope.password != $scope.confirmpassword) {
                    return false;
                }
                return true;
            }
        } ]);
