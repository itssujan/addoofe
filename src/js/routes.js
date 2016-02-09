angular.module('app')
    .run([ '$rootScope', '$state', '$stateParams','$location', 'Auth', 'Restangular','growl',
        'Idle','$intercom','$cookieStore',
        function ($rootScope, $state, $stateParams,$location, Auth,Restangular, growl,Idle,$intercom,$cookieStore) {
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;

            Idle.watch();

            // Logout function is available in any pages
            $rootScope.logout = function(){
              growl.success("Logged out.");
              console.log("Logging out user");
              Restangular.all('logout').post();
              invalidateSession();
              $location.url('login');
            };


            var invalidateSession = function() {
                $cookieStore.remove("user");
                Auth = {};
            }

            $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState) {
            
            console.log("is logged in :"+Auth.isLoggedIn);    
              if(!Auth.isLoggedIn) {
                    Auth.user = $cookieStore.get("user");
                    if(Auth.user){
                        Auth.isLoggedIn = true;
                    }
              }  
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
                  $state.go('login');console.log('p');
                  event.preventDefault();
              } 
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
                    templateUrl: 'templates/signup.html',
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
                    templateUrl: 'templates/trackbuilder.html',
                    ctrl: "trackbuilder",
                    controller: "TrackBuilderCtrl",
                    params : {
                        message : null,
                        selectedvideos : null
                    },
                    data: {requiresLogin: true}
                })                    
                .state('customer-manager.profile', {
                    url: '/profile',
                    templateUrl: 'templates/profile.html',
                    ctrl: "profileController",
                    controller: "ProfileController",
                    data: {requiresLogin: true},
                    params : {
                        managerRequired : null
                    },

                })
                .state('customer-manager.announcements', {
                    url: '/announcements',
                    templateUrl: 'templates/announcements.html',
                    ctrl: "announcementsMngrCtrl",
                    controller: "AnnouncementsMngrCtrl",
                    data: {requiresLogin: true},
                    params : {
                        managerRequired : null
                    },

                })
                .state('customer-manager.uploadcontent', {
                    url: '/uploadcontent',
                    templateUrl: 'templates/uploadcontent.html',
                    ctrl: "uploadContentCtrl",
                    controller: "UploadContentCtrl",
                    data: {requiresLogin: true},
                    params : {
                        managerRequired : null
                    },

                })
                .state('customer-manager.product-selection', {
                    url: '/productselection',
                    templateUrl: 'templates/productselector.html',
                    ctrl: "productSelectorCtrl",
                    controller: "ProductSelectorCtrl",
                    data: {requiresLogin: true},
                    params : {
                        managerRequired : null
                    },

                });

                $stateProvider
                .state('client', {
                    abstract: true,
                    url: '/client',
                    // templateUrl: 'templates/client/clientlayout.html',
                    template : '<div ui-view/>'
                })
                .state('client.dashboard', {
                    url: '/dashboard/:studentcourseID',
                    templateUrl: 'templates/client/dashboard.html',
                    ctrl: "clientDashboardController",
                    controller: "ClientDashboardController",
                    data: {requiresLogin: false},
                    params : {
                        src : null
                    },

                })
                .state('client.documentviewer', {
                    url: '/documentviewer',
                    templateUrl: 'app/onboarding/documentviewer.html',
                    ctrl: "clientDashboardController",
                    controller: "ClientDashboardController",
                    data: {requiresLogin: false}
                });
        }
    ]
)
