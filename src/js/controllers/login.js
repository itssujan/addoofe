angular.module('app')
.controller('LoginCtrl', [ '$scope', '$state','Restangular', '$rootScope', '$location', 
	'Auth','$cookieStore','growl','$mixpanel','$filter','$stateParams','Idle','growlMessages',
    function ($scope, $state, Restangular,$rootScope, $location, Auth,$cookieStore, growl, 
    	$mixpanel,$filter,$stateParams,Idle,growlMessages) {

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
			
			growlMessages.destroyAllMessages();

			$scope.loginbutton = "Logging in..";			    	
			$scope.user = {
				email: $filter('lowercase') ($scope.user.email),
				password: $scope.user.password,
				remember_me: $scope.user.remember_me
			};
			//console.log(User);
			Restangular.all('login').post($scope.user)
			.then(function(data){
			// No error: authentication OK
				console.log("Got user :"+JSON.stringify(data));
				$rootScope.user = data.user;
				$scope.auth.isLoggedIn = true;
				$scope.auth.user = data.user;

				Auth.user = data.user;
				$cookieStore.put("user",Auth.user);
				if(data.user.local.email){
					//$scope.user.role = "customer-support";
					// if(data.user.local.email.indexOf("sujan") > -1 || data.user.local.email.indexOf("hudson") > -1)
					// 	$mixpanel.register({"$ignore":true});
					$mixpanel.identify(data.user._id);
					$mixpanel.people.set({
						"$first_name" : data.user.local.firstname,
					    "$last_name": data.user.local.lastname,
					    "$email": data.user.email,    // only special properties need the $
					    "LastLogin": new Date(),
					});

					$mixpanel.track('Login');
			        Idle.watch();

					console.log("User logged in");
					if(data.user.role == "superadmin") {
						$state.go('customer-manager.product-selection');
					} else if(data.user.products.length > 1){
						$state.go('customer-manager.product-selection');
					} else {
						Restangular.one('product',data.user.products[0]).get().then(function (product) {
							if(product) {
								Auth.user.product = product.name;
								$cookieStore.put("user",Auth.user);
								if(Auth.user.permissions.indexOf('addUsers') < 0 && !Auth.user.manager && product.name == 'sharefile') {
									$state.go('customer-manager.profile',{managerRequired: true});	
								} else {
									$state.go('customer-manager.dashboard');	
								}
								
							}
						})
					}
				} else{

					$mixpanel.track("Login Failed", {
				        "Email": $scope.user.email
				    });

					growl.error("Login failed..please try again");
					$scope.loginbutton = "Login";

				}
			}, function(response){
					console.log("Logged in..");
					if(response.status != 200){
						$mixpanel.track("Login Failed", {
					        "Email": $scope.user.email
					    });
						growl.error("Login failed..please try again");
						$scope.loginbutton = "Login";
					}
			});
	    };
    } ]);


