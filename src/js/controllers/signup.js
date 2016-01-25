angular.module('app')
    .controller('SignUpCtrl', [ '$scope', '$state','Restangular', '$rootScope','$cookieStore','growl','$location', '$mixpanel',
        function ($scope, $state, Restangular,$rootScope,$cookieStore, growl, $location, $mixpanel) {
            console.log('In singup controller');

            $scope.user = {};
            $scope.$state = $state;

            // Register the login() function
		    $scope.signUp = function(){
		      console.log('Trying to signup :'+JSON.stringify($scope.user));
		      $scope.user = {
		      	firstname : $scope.user.firstname,
		      	lastname : $scope.user.lastname,
		      	product : $scope.user.pdt,
		      	role : $scope.user.role,
		      	email : $scope.user.email,
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
