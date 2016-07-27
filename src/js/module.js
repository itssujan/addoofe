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
    'com.2fdevs.videogular',
    'ngDialog',
    'ng.deviceDetector',
    'ngIdle',
    'ngS3upload',
    'ngIntercom',
    'chart.js',
    'ngAnimate',
    'reCAPTCHA',
    'ngRaven',
    'pdf'
	]);

app.config( 
[ '$controllerProvider', '$compileProvider', '$filterProvider', '$provide', '$interpolateProvider',
'RestangularProvider','$httpProvider','growlProvider','$mixpanelProvider', 'envServiceProvider','IdleProvider','KeepaliveProvider',
'ngS3Config','$intercomProvider','ngDialogProvider','reCAPTCHAProvider','$ravenProvider',
    function ($controllerProvider, $compileProvider, $filterProvider, $provide, $interpolateProvider, 
        RestangularProvider,$httpProvider, growlProvider, $mixpanelProvider,envServiceProvider,IdleProvider,
        KeepaliveProvider,ngS3Config,$intercomProvider,ngDialogProvider, reCAPTCHAProvider,$ravenProvider) {

    	envServiceProvider.config({
			domains: {
				development: ['localhost', 'dev.local'],
				production: ['app.addoo.io'],
                stage: ['app3.addoo.io','stageapp.addoo.io']
				// anotherStage: ['domain1', 'domain2'], 
				// anotherStage: ['domain1', 'domain2'] 
			},
			vars: {
				development: {
					nodeserverurl: 'http://localhost:3001',
                    //nodeserverurl: 'http://node.addoo.io',
					mixpaneltoken: "29e92907943764722a69ba3035295165",
                    connectorVideoID : "565d308268ff811332a5a20b",
                    sfPromotedVideoID : "574f069c2b4cad2e8a6686e8",
                    sfPromotedVideoContactId : "574f0fd02b4cad2e8a6686eb",
                    sfPromotedVideoContactEmail : "grady.slane@grr.la",
                    wootricAccountID: 'NPS-312d184b',
                    wootric_survey_immediately : true,
                    aws_bucket: 'addoo-dev',
                    intercom_id : "jqrpchg1"
				},
                stage : {
                    nodeserverurl: 'http://nodestage.addoo.io',
                    mixpaneltoken: "29e92907943764722a69ba3035295165",
                    connectorVideoID : "565d308268ff811332a5a20b",
                    sfPromotedVideoID : "574f069c2b4cad2e8a6686e8",
                    sfPromotedVideoContactId : "574f0fd02b4cad2e8a6686eb",
                    sfPromotedVideoContactEmail : "grady.slane@grr.la",
                    wootricAccountID: 'NPS-312d184b',
                    wootric_survey_immediately : true,
                    aws_bucket: 'addoo-dev',
                    intercom_id : "jqrpchg1"
                },
				production: {
					nodeserverurl: 'https://node.addoo.io', 
					mixpaneltoken: 'fdf3386dbfacfd13d6e4a580d0b5b9ae',
                    connectorVideoID : "56ba0db731d3360300643f19",
                    sfPromotedVideoID : "574f0642c591a20300a61bce",
                    sfPromotedVideoContactId : "574f0f9ec591a20300a61bd3",
                    sfPromotedVideoContactEmail : "grady.slane@citrix.com",
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

        // setting base url to nodejs server
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
        IdleProvider.timeout(28800); // in seconds
        KeepaliveProvider.interval(60); // in seconds

        //upload template
        ngS3Config.theme = '../templates/uploadtemplate';

        //intercom
        $intercomProvider.appID(envServiceProvider.read('intercom_id'));
        $intercomProvider.asyncLoading(true)

        //modal window
        ngDialogProvider.setDefaults({
            className: 'ngdialog-theme-plain',
            plain: false,
            showClose: true,
            closeByDocument: false,
            closeByEscape: true
        });

        reCAPTCHAProvider.setPublicKey('6LfTuxgTAAAAABd2ZVEkkJXG9toLX45W3DcSC7t_');

        reCAPTCHAProvider.setOptions({
            theme: 'clean'
        });

        $ravenProvider.development(false);
        Raven.config('https://ff826069d21e4a2eb7cc4902c386ec6c@app.getsentry.com/67624').install();
        if(envServiceProvider.environment == 'development') {
            $ravenProvider.development(true);
        }

    }
]);

app.factory('Auth',function() {
     return { isLoggedIn : false}; 
}).factory('UserRestangular','Restangular', function(Restangular) {
  return Restangular.withConfig(function(RestangularConfigurer){
    RestangularConfigurer.setRestangularFields({
      id: '_id'
    });
  });
}).factory('User','UserRestangular', function(UserRestangular){
     return 'UserRestangular.setRequestSuffix(login);'
});

app.factory('$exceptionHandler',
          ['$window', '$log','$raven',
  function ($window,   $log, $raven) {
      return function (exception, cause) {
        $raven.captureMessage(exception,cause);
      };
  }
]);

