var app = angular.module('app', [
	'ui.bootstrap', 
	'ui.router', 
	'ngCookies',
	'environment',
    'restangular',
    'analytics.mixpanel', //mixpanel
    'angular-growl', // for messages 
    'angular-clipboard',
    'smart-table',
    'angularMoment',
    'ui.tree',
    'ngLoadingSpinner',
    'pdf',
    'com.2fdevs.videogular',
    'ngDialog',
    'ng.deviceDetector',
    'ngIdle',
    'ngS3upload',
    'ngIntercom',
    'chart.js'
	]);

app.config( 
[ '$controllerProvider', '$compileProvider', '$filterProvider', '$provide', '$interpolateProvider',
'RestangularProvider','$httpProvider','growlProvider','$mixpanelProvider', 'envServiceProvider','IdleProvider','KeepaliveProvider',
'ngS3Config','$intercomProvider','ngDialogProvider',
    function ($controllerProvider, $compileProvider, $filterProvider, $provide, $interpolateProvider, 
        RestangularProvider,$httpProvider, growlProvider, $mixpanelProvider,envServiceProvider,IdleProvider,
        KeepaliveProvider,ngS3Config,$intercomProvider,ngDialogProvider) {

    	envServiceProvider.config({
			domains: {
				development: ['localhost', 'dev.local'],
				production: ['app.addoo.io'],
                stage: ['addoo-stage.herokuapp.com']
				// anotherStage: ['domain1', 'domain2'], 
				// anotherStage: ['domain1', 'domain2'] 
			},
			vars: {
				development: {
					nodeserverurl: 'http://localhost:3001',
                    //nodeserverurl: 'http://node.addoo.io',
					mixpaneltoken: "29e92907943764722a69ba3035295165",
                    wootricAccountID: 'NPS-312d184b',
                    wootric_survey_immediately : true,
                    aws_bucket: 'addoo-dev',
                    intercom_id : "jqrpchg1"
				},
                stage : {
                    nodeserverurl: 'https://addoonode-stage.herokuapp.com',
                    mixpaneltoken: "29e92907943764722a69ba3035295165",
                    wootricAccountID: 'NPS-312d184b',
                    wootric_survey_immediately : true,
                    aws_bucket: 'addoo-dev',
                    intercom_id : "jqrpchg1"
                },
				production: {
					nodeserverurl: 'http://node.addoo.io',
					mixpaneltoken: 'fdf3386dbfacfd13d6e4a580d0b5b9ae',
                    wootricAccountID: 'NPS-ecd3e1b3',
                    wootric_survey_immediately : false,
                    aws_bucket: 'addoo',
                    intercom_id : "jqrpchg1"
				}
			}
		});
 
		// run the environment check, so the comprobation is made 
		// before controllers and services are built 
		envServiceProvider.check();
		
        growlProvider.globalTimeToLive(5000); // messages time to fade
        growlProvider.globalDisableIcons(true); // disable icons in messages
        growlProvider.globalDisableCloseButton(true);
        growlProvider.globalDisableCountDown(true);
        growlProvider.globalPosition('top-center');

        //console.log("In AppController "+nodeserverurl);
        //console.log("process.env.nodeserverurl :"+process.env.ADDOO_NODE_URL);

        // setting base url to nodejs server
        console.log(envServiceProvider);
        console.log('Node URL :'+envServiceProvider.read('nodeserverurl'));
        RestangularProvider.setBaseUrl(envServiceProvider.read('nodeserverurl'));
        RestangularProvider.setRestangularFields({
          id: "_id"
        });

        // ngClipProvider.setPath("swf/ZeroClipboard.swf");

        app.controller = $controllerProvider.register;
        app.directive = $compileProvider.directive;
        app.filter = $filterProvider.register;
        app.factory = $provide.factory;
        app.service = $provide.service;
        app.constant = $provide.constant;
        app.value = $provide.value;
        app.nodeserverurl = envServiceProvider.read('nodeserverurl');

        // $interpolateProvider.startSymbol('::');
        // $interpolateProvider.endSymbol('::');

        $httpProvider.defaults.withCredentials = true;

        $mixpanelProvider.apiKey(envServiceProvider.read('mixpaneltoken')); // your token 

            // configure Idle settings
        IdleProvider.idle(28800); // in seconds  ; 28800 = 8 hours
        IdleProvider.timeout(60); // in seconds
        KeepaliveProvider.interval(60); // in seconds

        //upload template
        ngS3Config.theme = '../templates/uploadtemplate';

        //intercom
        $intercomProvider.appID(envServiceProvider.read('intercom_id'));
        $intercomProvider.asyncLoading(true)

        //modal window
        ngDialogProvider.setForceHtmlReload(true);
        //ngDialogProvider.setForceBodyReload(true);

    }
]);

app.factory('Auth',function() {
     console.log("")
     return { isLoggedIn : false}; 
}).factory('UserRestangular','Restangular', function(Restangular) {
    console.log("Test");
    console.log(Restangular);
  return Restangular.withConfig(function(RestangularConfigurer){
    RestangularConfigurer.setRestangularFields({
      id: '_id'
    });
  });
}).factory('User','UserRestangular', function(UserRestangular){
     console.log(UserRestangular);
     return 'UserRestangular.setRequestSuffix(login);'
});
