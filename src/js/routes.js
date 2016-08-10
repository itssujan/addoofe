    angular.module('app')
    .run([ '$rootScope', '$state', '$stateParams','$location', 'Auth', 'Restangular','growl',
        'Idle','$cookieStore','$window','envService',
        function ($rootScope, $state, $stateParams,$location, Auth,Restangular, 
            growl, Idle, $cookieStore, $window, envService) {
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;

            Idle.watch();

            //Force HTTPS
            var forceSSL = function () {
                if ($location.protocol() !== 'https' && 
                    (envService.environment != 'development' && envService.environment != 'stage')) {
                    $window.location.href = $location.absUrl().replace('http:', 'https:');
                }
            };

            forceSSL();

            // Logout function is available in any pages
            $rootScope.logout = function(){
              growl.success("Logged out.");
              console.log("Logging out user");
              Restangular.all('logout').post();
              invalidateSession();
              window.driftt = undefined;
              window.drift = undefined;
              $location.url('login');
            };


            var invalidateSession = function() {
                $cookieStore.remove("user");
                Auth = {};
            }

            $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState) {
              if(!Auth.isLoggedIn) {
                    Auth.user = $cookieStore.get("user");
                    if(Auth.user){
                        Auth.isLoggedIn = true;
                    }
              }  

               function isServerSessionValid() {
                    Restangular.one('loggedin').get().then(function(data){
                        if(!data._id || !Auth.isLoggedIn){
                            console.log("Login required");
                            $state.go('login');
                            event.preventDefault();
                            return;
                        } else {
                            console.log("Login not required");
                        } 
                    })
                }

               var shouldLogin = toState.data !== undefined && toState.data.requiresLogin;

              // NOT authenticated - wants any private stuff
              if(shouldLogin){
                isServerSessionValid();
              }         
              
              // authenticated (previously) comming not to root main
              if(Auth.isLoggedIn && toState.name != "client.dashboardnew")  {
                return;
              }

              
              // // UNauthenticated (previously) comming not to root public 
              // var shouldGoToPublic = fromState.name === "" && toState.name !== "public" && toState.name !== "login" ;
                
              // if(shouldGoToPublic) {
              //     $state.go('login');
              //     console.log('p');
              //     event.preventDefault();
              // } 
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
                })
                .state('signup', {
                    url: '/sign-up/:invitationCode',
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
                    ctrl: "dashboard",
                    controller: "DashboardCtrl",
                    data: {requiresLogin: true}
                }).state('customer-manager.trackbuilder', {
                    url: '/trackbuilder/:studentCourseID',
                    templateUrl: 'templates/trackbuilder.html',
                    ctrl: "trackbuilder",
                    controller: "TrackBuilderCtrl",
                    params : {
                        message : null,
                        selectedvideos : null
                    },
                    data: {requiresLogin: true}
                })
                .state('customer-manager.build', {
                    url: '/build/:courseID',
                    templateUrl: 'templates/trackbuilder.html',
                    ctrl: "trackbuilder",
                    controller: "TrackBuilderCtrl",
                    params : {
                        message : null,
                        selectedvideos : null,
                        showClientModal : null
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
                    data: {requiresLogin: true}

                })
                .state('customer-manager.uploadcontent', {
                    url: '/uploadcontent',
                    templateUrl: 'templates/uploadcontent.html',
                    ctrl: "uploadContentCtrl",
                    controller: "UploadContentCtrl",
                    data: {requiresLogin: true}
                })
                .state('customer-manager.viewcontent', {
                    url: '/viewcontent',
                    templateUrl: 'templates/viewcontent.html',
                    ctrl: "viewContentCtrl",
                    controller: "ViewContentCtrl",
                    data: {requiresLogin: true}
                })
                .state('customer-manager.editcontent', {
                    url: '/editcontent/:videoID',
                    templateUrl: 'templates/editcontent.html',
                    ctrl: "editContentCtrl",
                    controller: "EditContentCtrl",
                    data: {requiresLogin: true}
                })
                .state('customer-manager.product-selection', {
                    url: '/productselection',
                    templateUrl: 'templates/productselector.html',
                    ctrl: "productSelectorCtrl",
                    controller: "ProductSelectorCtrl",
                    data: {requiresLogin: true}
                })
                .state('customer-manager.inviteusers', {
                    url: '/inviteusers',
                    templateUrl: 'templates/inviteusers.html',
                    ctrl: "inviteUsersCtrl",
                    controller: "InviteUsersCtrl",
                    data: {requiresLogin: true}
                })
                .state('customer-manager.leads', {
                    url: '/leads',
                    templateUrl: 'templates/leads.html',
                    ctrl: "leadsCtrl",
                    controller: "LeadsCtrl",
                    data: {requiresLogin: true}
                })
                .state('customer-manager.reports', {
                    url: '/reports',
                    templateUrl: 'templates/reports.html',
                    ctrl: "reportsCtrl",
                    controller: "ReportsCtrl",
                    data: {requiresLogin: true}
                }).state('customer-manager.viewproducts', {
                    url: '/viewproducts',
                    templateUrl: 'templates/viewproducts.html',
                    ctrl: "viewProductsCtrl",
                    controller: "ViewProductsCtrl",
                    data: {requiresLogin: true}
                }).state('customer-manager.createproduct', {
                    url: '/createproduct',
                    templateUrl: 'templates/editproduct.html',
                    ctrl: "editProductCtrl",
                    controller: "EditProductCtrl",
                    data: {requiresLogin: true}
                }).state('customer-manager.editproduct', {
                    url: '/editproduct/:productID',
                    templateUrl: 'templates/editproduct.html',
                    ctrl: "editProductCtrl",
                    controller: "EditProductCtrl",
                    data: {requiresLogin: true}
                });


                $stateProvider
                .state('customer-care', {
                    abstract: true,
                    url: '/customer-care',
                    templateUrl: 'templates/layout.html',
                    access: {
                        requiresLogin: true
                    }
                })
                .state('customer-care.dashboard', {
                    url				: '/dashboard',
                    templateUrl		: 'templates/customercare/CustomerCareDashboard.html',
                    ctrl			: "CustomerCareDashboardController",
                    controller		: "CustomerCareDashboardController",
                    data			: { requiresLogin: true }
                });

                $stateProvider
                .state('client', {
                    abstract: true,
                    url: '/client',
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
                .state('client.dashboardnew', {
                    url: '/dashboard/v2/:studentcourseID',
                    templateUrl: 'templates/client/dashboard.html',
                    ctrl: "clientDashboardController",
                    controller: "ClientDashboardController",
                    data: {requiresLogin: false},
                    params : {
                        src : null
                    },

                })

                $stateProvider
                .state('onboarding', {
                    abstract: true,
                    url: '/onboarding',
                    template : '<div ui-view/>'
                })
                .state('onboarding.dashboardnew', {
                    url: '/dashboard/:product',
                    templateUrl: 'templates/client/dashboard.html',
                    ctrl: "clientDashboardController",
                    controller: "ClientDashboardController",
                    data: {requiresLogin: false},
                    params : {
                        src : null
                    },

                })


                // .state('client.dashboard2', {
                //     url: 'dashboard/:studentcourseID',
                //     templateUrl: 'templates/client/dashboard.html',
                //     ctrl: "clientDashboardController",
                //     controller: "ClientDashboardController",
                //     data: {requiresLogin: false},
                //     params : {
                //         src : null
                //     },

                // })
                .state('client.documentviewer', {
                    url: '/documentviewer',
                    templateUrl: 'templates/client/documentviewer.html',
                    ctrl: "clientDocViewerCtrl",
                    controller: "ClientDocViewerCtrl",
                    data: {requiresLogin: false}
                });

                $stateProvider
                .state('public', {
                    abstract: true,
                    url: '/public',
                    templateUrl: 'templates/public/layout.html',
                    access: {
                        requiresLogin: false
                    }
                }).state('public.forgotpassword', {
                    url             : '/forgotpassword',
                    templateUrl     : 'templates/public/forgotpassword.html',
                    ctrl            : "forgotPasswordCtrl",
                    controller      : "ForgotPasswordCtrl",
                    data            : { requiresLogin: false }
                }).state('public.resetpassword', {
                    url             : '/resetpassword/:resetcode',
                    templateUrl     : 'templates/public/resetpassword.html',
                    ctrl            : "forgotPasswordCtrl",
                    controller      : "ForgotPasswordCtrl",
                    data            : { requiresLogin: false }
                });
        }
    ]
)
