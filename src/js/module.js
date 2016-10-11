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
    'com.2fdevs.videogular.plugins.controls',
    'info.vietnamcode.nampnq.videogular.plugins.youtube',
    'ngDialog',
    'ng.deviceDetector',
    'ngIdle',
    'ngS3upload',
    'chart.js',
    'ngAnimate',
    'reCAPTCHA',
    'pdf',
    'angulartics', 
    'angulartics.google.analytics',
    'froala'
	]);

 app.value('froalaConfig', {
        key : 'LDIE1QCYRWa2GPIb1d1H1==',
        toolbarInline: false,
        placeholderText: 'Enter Text Here'
    });

app.config( 
[ '$controllerProvider', '$compileProvider', '$filterProvider', '$provide', '$interpolateProvider',
'RestangularProvider','$httpProvider','growlProvider','$mixpanelProvider', 'envServiceProvider','IdleProvider','KeepaliveProvider',
'ngS3Config','ngDialogProvider','reCAPTCHAProvider','$analyticsProvider','ChartJsProvider',
    function ($controllerProvider, $compileProvider, $filterProvider, $provide, $interpolateProvider, 
        RestangularProvider,$httpProvider, growlProvider, $mixpanelProvider,envServiceProvider,IdleProvider,
        KeepaliveProvider,ngS3Config,ngDialogProvider, reCAPTCHAProvider,$analyticsProvider, ChartJsProvider) {

    	envServiceProvider.config({
			domains: {
				development: ['localhost', 'dev.local'],
				production: ['app.addoo.io','training.sharefile.com','training.shareconnect.com'],
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
                    inappuser : 'ts3@grr.la',
                    inappserverurl : 'http://localhost:3000/js/addooplugin.min.js',
                    //inappToken : "790ad311022769ef305aca262cb2d7b8f26736decb489a6e2e49e4e1d4b240f0fe522a2ace7a928f55b72bc8a99b5e4b",
                    inappToken : "d4cd612479194db0937463781105921ea3f32f5148aede2f22e97f79e98d10ff1785d5711e3a77931a38a6dbc9d74029d64eeaa8b77c2be547ad701dbb595cc8",
                    //inappToken : "b4aa689f9f4dc2309a3c9406b1ef605252359590b9c832e932e53aec3d91589e62434e8182cbc4a53964c6111ac9209e",//sharefile prod
                    //inappToken : "790ad311022769ef305aca262cb2d7b8f26736decb489a6e2e49e4e1d4b240f0fe522a2ace7a928f55b72bc8a99b5e4b",
                    enableGA : false
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
                    inappuser : 'ts3@grr.la',  
                    inappserverurl : 'https://plugin.addoo.io/js/addooplugin.min.js',
                    inappToken : "d4cd612479194db0937463781105921ea3f32f5148aede2f22e97f79e98d10ff1785d5711e3a77931a38a6dbc9d74029d64eeaa8b77c2be547ad701dbb595cc8",
                    enableGA : true
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
                    inappuser : 'addoo-users@grr.la',
                    inappserverurl : 'https://plugin.addoo.io/js/addooplugin.min.js',
                    inappToken : "790ad311022769ef305aca262cb2d7b8f26736decb489a6e2e49e4e1d4b240f0fe522a2ace7a928f55b72bc8a99b5e4b",
                    enableGA : true
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

        console.log("GA Enabled :"+envServiceProvider.read('enableGA'));
        if(envServiceProvider.read('enableGA') == true) {
            console.log("Loading GA");
            (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
              (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
              m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
              })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

              ga('create', 'UA-81862521-1', 'auto');
              ga('send', 'pageview');
         }     

        $analyticsProvider.virtualPageviews(false);
        $analyticsProvider.settings.ga = {
            additionalAccountNames: undefined,
            disableEventTracking: null,
            disablePageTracking: null,
            userId: 'UA-81862521-1'
        };

        ChartJsProvider.setOptions({ colors : [ '#803690', '#00ADF9', '#DCDCDC', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'] });


        // window.doorbellOptions = {
        //     appKey: 'YL2dc2ZGv0BXAWR82PuYNlVmULaEftefXP6j6zxtfmfvUBpCwCgiE1l7evPy0K7n'
        // };
        // (function(w, d, t) {
        //     var hasLoaded = false;
        //     function l() { if (hasLoaded) { return; } hasLoaded = true; window.doorbellOptions.windowLoaded = true; var g = d.createElement(t);g.id = 'doorbellScript';g.type = 'text/javascript';g.async = true;g.src = 'https://embed.doorbell.io/button/4209?t='+(new Date().getTime());(d.getElementsByTagName('head')[0]||d.getElementsByTagName('body')[0]).appendChild(g); }
        //     if (w.attachEvent) { w.attachEvent('onload', l); } else if (w.addEventListener) { w.addEventListener('load', l, false); } else { l(); }
        //     if (d.readyState == 'complete') { l(); }
        // }(window, document, 'script'));
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
          ['$window', '$log', '$analytics',
  function ($window,   $log, $analytics) {
        return function (exception, cause) {
            $analytics.eventTrack("exception :"+exception+" ; cause : "+cause, {  category: 'Exception', label: 'JS-Exceptions' });
            console.log("EXCEPTION :"+cause+" ; "+exception);
        };
  }
]);

