angular.module('app')
    .run([ '$rootScope', '$state', '$stateParams','$location', 'Auth', 'Restangular','growl',
        function ($rootScope, $state, $stateParams,$location, Auth,Restangular, growl) {
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;

            // Logout function is available in any pages
            $rootScope.logout = function(){
              growl.success("Logged out.");
              console.log("Logging out user");
              Restangular.all('logout').post();
              $location.url('login');

            };

            $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState) {
  
              var shouldLogin = toState.data !== undefined && toState.data.requiresLogin  && !Auth.isLoggedIn ;

              // NOT authenticated - wants any private stuff
              if(shouldLogin){
                console.log('Please login..')
                $state.go('login');
                event.preventDefault();
                return;
              }         
              
              // authenticated (previously) comming not to root main
              if(Auth.isLoggedIn)  {
                var shouldGoToMain = fromState.name === "" && toState.name !== "main" ;
                  
                if (shouldGoToMain) {
                    $state.go('main');
                    event.preventDefault();
                } 
                return;
              }
              
              // UNauthenticated (previously) comming not to root public 
              var shouldGoToPublic = fromState.name === "" && toState.name !== "public" && toState.name !== "login" ;
                
              if(shouldGoToPublic) {
                  $state.go('public');console.log('p');
                  event.preventDefault();
              } 
          // unmanaged
        });
        }
    ])
    .config(
    [ '$stateProvider', '$urlRouterProvider',
        function ($stateProvider, $urlRouterProvider) {

            $urlRouterProvider
           // .when('/','/abc')
            .otherwise('/login');

            $stateProvider
                .state('/', {
                    url: '/',
                    templateUrl: 'templates/login.html',
                    ctrl: 'login',
                    controller: 'LoginCtrl'
                })
                .state('login', {
                    url: '/login',
                    templateUrl: 'templates/login.html',
                    ctrl: 'login',
                    controller: 'LoginCtrl'
                })
                .state('sign-up', {
                    url: '/sign-up',
                    templateUrl: 'templates/sign-up.html',
                    ctrl : 'signUp',
                    controller: 'SignUpCtrl'
                }).state('logout', {
                    url: '/logout',
                    templateUrl: 'templates/login.html',
                    ctrl : 'signUp',
                    controller: 'LogoutCtrl'
                });


                $stateProvider
                .state('customer-manager', {
                    abstract: true,
                    url: '/customer-manager',
                    templateUrl: 'templates/layout.html',
                    access: {
                        requiresLogin: true,
                        // requiredPermissions:  ['Instructor']
                    }
                })
                .state('customer-manager.dashboard', {
                    url: '/dashboard',
                    templateUrl: 'templates/dashboard.html',
                    ctrl: "ccdashboard",
                    controller: "DashboardCtrl",
                    data: {requiresLogin: true}
                }).state('customer-manager.trackbuilder', {
                    url: '/trackbuilder/:courseID',
                    templateUrl: 'app/onboarding/cc/trackbuilder.html',
                    ctrl: "cctrackbuilder",
                    controller: "CCTrackBuilderCtrl",
                    data: {requiresLogin: true}
                })                    
                .state('customer-manager.profile', {
                    url: '/profile',
                    templateUrl: 'app/onboarding/cc/profile.html',
                    ctrl: "profileController",
                    controller: "ProfileController",
                    data: {requiresLogin: true}
                });

            //     $stateProvider
            //     .state('client', {
            //         abstract: true,
            //         url: '/client',
            //         template: '<div ui-view class="ui-view-main" />',
            //     })
            //     .state('client.dashboard', {
            //         url: '/dashboard/:studentcourseID',
            //         templateUrl: 'app/onboarding/clientdashboard.html',
            //         ctrl: "clientDashboardController",
            //         controller: "ClientDashboardController",
            //         data: {requiresLogin: false}
            //     })
            //     .state('client.documentviewer', {
            //         url: '/documentviewer',
            //         templateUrl: 'app/onboarding/documentviewer.html',
            //         ctrl: "clientDashboardController",
            //         controller: "ClientDashboardController",
            //         data: {requiresLogin: false}
            //     });

        }
    ]
)
