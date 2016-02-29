angular.module('app')
    .controller('SignUpCtrl', [ '$scope', '$state','Restangular', '$rootScope','$cookieStore','growl',
    	'$location', '$mixpanel','$filter','$stateParams',
        function ($scope, $state, Restangular,$rootScope,$cookieStore, growl, $location, $mixpanel,$filter,$stateParams) {
            console.log('In singup controller');

            $scope.user = {};
            $scope.$state = $state;
            $scope.invitationCode	= $stateParams.invitationCode;

			var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
            var mediumRegex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");
 
 			$scope.passwordStrength = {
                "float": "right",
                "width": "100px",
                "height": "25px",
                "margin-left": "5px"
            };

            Restangular.one("signupinvite?invitationCode="+$scope.invitationCode).get().then(function(data){
            	console.log("DATA :"+JSON.stringify(data[0]));
            	$scope.signupinvite = data[0];
            	$scope.user.pdt = $scope.signupinvite.product;
            	$scope.user.email = $scope.signupinvite.invitedEmail;
            	$scope.user.role = 'customer-manager';
            	console.log("USer :"+JSON.stringify($scope.user));
            });

            $scope.analyze = function(value) {
                if(strongRegex.test(value)) {
                    $scope.passwordStrength["background-color"] = "green";
                    $scope.passwordStrengthMessage = "Strong";
                } else if(mediumRegex.test(value)) {
                    $scope.passwordStrength["background-color"] = "orange";
                    $scope.passwordStrengthMessage = "Weak";
                } else {
                    $scope.passwordStrength["background-color"] = "red";
                    $scope.passwordStrengthMessage = "Very Weak";
                }
            };


            // Register the login() function
		    $scope.signUp = function(){
		      console.log('Trying to signup :'+JSON.stringify($scope.user));
		      $scope.user = {
		      	firstname : $scope.user.firstname,
		      	lastname : $scope.user.lastname,
		      	product : $scope.user.pdt,
		      	role : $scope.user.role,
		      	email : $filter('lowercase') ($scope.user.email),
		      	password : $scope.user.password
		      };
		      console.log($scope.user);
		      Restangular.all('signup').post($scope.user)
		      .then(function(user){
		        // No error: authentication OK
		        console.log('User signedup :'+user.name);
				$mixpanel.people.set({
					"$first_name" : $scope.user.firstname,
				    "$last_name": $scope.user.lastname,
				    "$email": $scope.user.email,    // only special properties need the $
				    "$created": new Date(),
				});
				$mixpanel.identify(user._id);
				$mixpanel.alias(user._id);

		        $location.url('/login');

		      }, function(response) {
		      		if(response.status != 200)
			      		growl.error(response.data.message);
		      });
		    };
        } ]);
