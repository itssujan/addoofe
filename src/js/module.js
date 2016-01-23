var nodeserverurl = 'http://localhost:3001'; 
var mixpaneltoken = "29e92907943764722a69ba3035295165";

var app = angular.module('app', [
	'ui.bootstrap', 
	'ui.router', 
	'ngCookies',
    'restangular',
    'analytics.mixpanel', //mixpanel
    'angular-growl', // for messages 
    'ngClipboard',
    'ngFileUpload',
    'smart-table',
    'angularMoment'
	]);



app.config( 
[ '$controllerProvider', '$compileProvider', '$filterProvider', '$provide', '$interpolateProvider',
'RestangularProvider','$httpProvider','growlProvider','ngClipProvider','$mixpanelProvider', 
    function ($controllerProvider, $compileProvider, $filterProvider, $provide, $interpolateProvider, 
        RestangularProvider,$httpProvider, growlProvider, ngClipProvider, $mixpanelProvider ) {

        growlProvider.globalTimeToLive(5000); // messages time to fade
        growlProvider.globalDisableIcons(true); // disable icons in messages
        growlProvider.globalDisableCloseButton(true);
        growlProvider.globalDisableCountDown(true);
        growlProvider.globalPosition('top-center');

        //console.log("In AppController "+nodeserverurl);
        //console.log("process.env.nodeserverurl :"+process.env.ADDOO_NODE_URL);

        // setting base url to nodejs server
        console.log(nodeserverurl);
        RestangularProvider.setBaseUrl(nodeserverurl);
        RestangularProvider.setRestangularFields({
          id: "_id"
        });

        ngClipProvider.setPath("../../../bower_components/zeroclipboard/dist/ZeroClipboard.swf");

        app.controller = $controllerProvider.register;
        app.directive = $compileProvider.directive;
        app.filter = $filterProvider.register;
        app.factory = $provide.factory;
        app.service = $provide.service;
        app.constant = $provide.constant;
        app.value = $provide.value;
        app.nodeserverurl = nodeserverurl;

        // $interpolateProvider.startSymbol('::');
        // $interpolateProvider.endSymbol('::');

        $httpProvider.defaults.withCredentials = true;

        $mixpanelProvider.apiKey(mixpaneltoken); // your token 

    }
]);

app.factory('ConstantService', function() {
  return {
      nodeserverurl : nodeserverurl
  };
}).factory('Auth',function() {
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
