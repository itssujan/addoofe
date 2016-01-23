// angular
//     .module('app')
//     .controller('LoginCtrl', ['$scope', function($scope){
//         console.log("Inside login controller");
//     }]);



angular.module('app')
.controller('LoginCtrl', [ '$scope', '$state','Restangular', '$rootScope', '$location', 
	'Auth','$cookieStore','growl','$mixpanel',
    function ($scope, $state, Restangular,$rootScope, $location, Auth, $cookieStore, growl, $mixpanel) {

        console.log('In login controller');

    	$scope.addSpecialWarnMessage = function() {
			growl.addWarnMessage("This adds a warn message");
		};


        $scope.user = {};
        $scope.auth = Auth;
        $scope.$state = $state;
        $scope.loginbutton = "Login";

        // Register the login() function
	    $scope.login = function(){

			$scope.loginbutton = "Logging in..";			    	
			$scope.user = {
				email: $scope.user.email,
				password: $scope.user.password,
			};
			console.log($scope.user);
			//console.log(User);
			Restangular.all('login').post($scope.user)
			.then(function(data){
			// No error: authentication OK
				console.log('User authentcated :'+JSON.stringify(data.user));
				console.log(data.user);

				$rootScope.user = data.user;
				$scope.auth.isLoggedIn = true;
				$scope.auth.user = data.user;
				Auth.user = data.user;
				console.log("User role afte the api call :"+$scope.user.role);
				if(data.user.local.email){
					//$scope.user.role = "customer-support";
					if(data.user.local.email.indexOf("sujan") > -1 || data.user.local.email.indexOf("hudson") > -1)
						$mixpanel.register({"$ignore":true});
					$mixpanel.identify(data.user._id);
					$mixpanel.people.set({
						"$first_name" : data.user.local.firstname,
					    "$last_name": data.user.local.lastname,
					    "$email": data.user.email,    // only special properties need the $
					    "LastLogin": new Date(),
					});

					$mixpanel.track('Login');

					console.log("Changed role :"+$scope.user.role);
					if(data.user.role == "customer-onboarding-specialist" 
						|| data.user.role == "customer-manager" 
						|| data.user.role == "sales" ){
						$state.go('customer-manager.dashboard');
					}
				} else{

					$mixpanel.track("Login Failed", {
				        "Email": $scope.user.email
				    });

					growl.error("Login failed..please try again");
				}
			}, function(response){
					console.log("Logged in..");
					if(response.status != 200){
					$mixpanel.track("Login Failed", {
				        "Email": $scope.user.email
				    });
					growl.error("Login failed..please try again");
					}
			});
	    };
    } ]);


