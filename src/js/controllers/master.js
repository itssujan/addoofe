/**
 * Master Controller
 */

angular.module('app')
    .controller('MasterCtrl', ['$rootScope','$scope', '$cookieStore','Auth','envService','Idle', MasterCtrl]);

function MasterCtrl($rootScope,$scope, $cookieStore,Auth,envService,Idle) {
    console.log("MasterCtrl");
    var mobileView = 992;
    $scope.events = [];

    $scope.user = Auth.user;
    $scope.user.name = $scope.user.local.firstname+" "+$scope.user.local.lastname;
    $scope.user.created_at = Math.floor((new Date(Auth.user.createdOn).getTime())/1000);
    $scope.user.user_id = $scope.user._id;

    //test
    /**
     * Sidebar Toggle & Cookie Control
     */

    // if($scope.user.email == 'itssujan@gmail.com' || $scope.user.email == 'hudson.haines@citrix.com' || $scope.user.email == 'sujan.abraham@citrix.com') { 
    if(true) {
        window.AddooSettings = {
            token : envService.read('inappToken'),
            userID : $scope.user.email, 
            email : $scope.user.email,
            product : 'addoo'
        }
        window.lightningjs||function(c){function g(b,d){d&&(d+=(/\?/.test(d)?"&":"?")+"lv=1");c[b]||function(){var i=window,h=document,j=b,g=h.location.protocol,l="load",k=0;(function(){function b(){a.P(l);a.w=1;c[j]("_load")}c[j]=function(){function m(){m.id=e;return c[j].apply(m,arguments)}var b,e=++k;b=this&&this!=i?this.id||0:0;(a.s=a.s||[]).push([e,b,arguments]);m.then=function(b,c,h){var d=a.fh[e]=a.fh[e]||[],j=a.eh[e]=a.eh[e]||[],f=a.ph[e]=a.ph[e]||[];b&&d.push(b);c&&j.push(c);h&&f.push(h);return m};return m};var a=c[j]._={};a.fh={};a.eh={};a.ph={};a.l=d?d.replace(/^\/\//,(g=="https:"?g:"http:")+"//"):d;a.p={0:+new Date};a.P=function(b){a.p[b]=new Date-a.p[0]};a.w&&b();i.addEventListener?i.addEventListener(l,b,!1):i.attachEvent("on"+l,b);var q=function(){function b(){return["<head></head><",c,' onload="var d=',n,";d.getElementsByTagName('head')[0].",d,"(d.",g,"('script')).",i,"='",a.l,"'\"></",c,">"].join("")}var c="body",e=h[c];if(!e)return setTimeout(q,100);a.P(1);var d="appendChild",g="createElement",i="src",k=h[g]("div"),l=k[d](h[g]("div")),f=h[g]("iframe"),n="document",p;k.style.display="none";e.insertBefore(k,e.firstChild).id=o+"-"+j;f.frameBorder="0";f.id=o+"-frame-"+j;/MSIE[ ]+6/.test(navigator.userAgent)&&(f[i]="javascript:false");f.allowTransparency="true";l[d](f);try{f.contentWindow[n].open()}catch(s){a.domain=h.domain,p="javascript:var d="+n+".open();d.domain='"+h.domain+"';",f[i]=p+"void(0);"}try{var r=f.contentWindow[n];r.write(b());r.close()}catch(t){f[i]=p+'d.write("'+b().replace(/"/g,String.fromCharCode(92)+'"')+'");d.close();'}a.P(2)};a.l&&q()})()}();c[b].lv="1";return c[b]}var o="lightningjs",k=window[o]=g(o);k.require=g;k.modules=c}({});
        window.Addoo = lightningjs.require("Addoo", envService.read('inappserverurl'));
        window.Addoo("start");  
    } else {
    // // <!-- Start of Async Drift Code -->
        !function(){var t;return t=window.driftt=window.drift=window.driftt||[],t.init?void 0:t.invoked?void(window.console&&console.error&&console.error("Drift snippet included twice.")):(t.invoked=!0,t.methods=["identify","track","reset","debug","show","ping","page","hide","off","on"],t.factory=function(e){return function(){var n;return n=Array.prototype.slice.call(arguments),n.unshift(e),t.push(n),t}},t.methods.forEach(function(e){t[e]=t.factory(e)}),t.load=function(t){var e,n,o,r;e=3e5,r=Math.ceil(new Date/e)*e,o=document.createElement("script"),o.type="text/javascript",o.async=!0,o.crossorigin="anonymous",o.src="https://js.driftt.com/include/"+r+"/"+t+".js",n=document.getElementsByTagName("script")[0],n.parentNode.insertBefore(o,n)})}(),drift.SNIPPET_VERSION="0.2.0",drift.load("xrz4aebz9bbs");
        driftt.identify($scope.user._id, { email: $scope.user.email  });
    }
    // <!-- End of Async Drift Code -->

    // // UserVoice JavaScript SDK (only needed once on a page) 
    // (function(){var uv=document.createElement('script');uv.type='text/javascript';uv.async=true;uv.src='//widget.uservoice.com/XQtFzFO0GKH4NfNjKtSFg.js';var s=document.getElementsByTagName('script')[0];s.parentNode.insertBefore(uv,s)})()

    // <!-- A tab to launch the Classic Widget -->
    // UserVoice = window.UserVoice || [];
    // UserVoice.push(['showTab', 'classic_widget', {
    //   mode: 'feedback',
    //   primary_color: '#cc6d00',
    //   link_color: '#007dbf',
    //   forum_id: 341319,
    //   tab_label: 'Feedback',
    //   tab_color: '#cc6d00',
    //   tab_position: 'top-right',
    //   tab_inverted: false
    // }]);

    // Wootric -- NPS Survery start
    // wootric_survey_immediately = envService.read('wootric_survey_immediately'); // Shows survey immediately for testing purposes.  TODO: Comment out for production.
    //  window.wootricSettings = {
    //     email: Auth.user.email,// TODO: The current logged in user's email address.
    //     created_at: Math.floor((new Date(Auth.user.createdOn).getTime())/1000), // TODO: The current logged in user's sign-up date as a 10 digit Unix timestamp in seconds.
    //     account_token: envService.read('wootricAccountID') // This is your unique account token.
    // };

    // if(window.wootricSettings){i=new Image;i.src="//d8myem934l1zi.cloudfront.net/pixel.gif?account_token="+window.wootricSettings.account_token+"&email="+encodeURIComponent(window.wootricSettings.email)+"&created_at="+window.wootricSettings.created_at+"&url="+encodeURIComponent(window.location)+"&random="+Math.random()}window.lightningjs||function(c){function g(b,d){d&&(d+=(/\?/.test(d)?"&":"?")+"lv=1");c[b]||function(){var i=window,h=document,j=b,g=h.location.protocol,l="load",k=0;(function(){function b(){a.P(l);a.w=1;c[j]("_load")}c[j]=function(){function m(){m.id=e;return c[j].apply(m,arguments)}var b,e=++k;b=this&&this!=i?this.id||0:0;(a.s=a.s||[]).push([e,b,arguments]);m.then=function(b,c,h){var d=a.fh[e]=a.fh[e]||[],j=a.eh[e]=a.eh[e]||[],f=a.ph[e]=a.ph[e]||[];b&&d.push(b);c&&j.push(c);h&&f.push(h);return m};return m};var a=c[j]._={};a.fh={};a.eh={};a.ph={};a.l=d?d.replace(/^\/\//,(g=="https:"?g:"http:")+"//"):d;a.p={0:+new Date};a.P=function(b){a.p[b]=new Date-a.p[0]};a.w&&b();i.addEventListener?i.addEventListener(l,b,!1):i.attachEvent("on"+l,b);var q=function(){function b(){return["<head></head><",c,' onload="var d=',n,";d.getElementsByTagName('head')[0].",d,"(d.",g,"('script')).",i,"='",a.l,"'\"></",c,">"].join("")}var c="body",e=h[c];if(!e)return setTimeout(q,100);a.P(1);var d="appendChild",g="createElement",i="src",k=h[g]("div"),l=k[d](h[g]("div")),f=h[g]("iframe"),n="document",p;k.style.display="none";e.insertBefore(k,e.firstChild).id=o+"-"+j;f.frameBorder="0";f.id=o+"-frame-"+j;/MSIE[ ]+6/.test(navigator.userAgent)&&(f[i]="javascript:false");f.allowTransparency="true";l[d](f);try{f.contentWindow[n].open()}catch(s){a.domain=h.domain,p="javascript:var d="+n+".open();d.domain='"+h.domain+"';",f[i]=p+"void(0);"}try{var r=f.contentWindow[n];r.write(b());r.close()}catch(t){f[i]=p+'d.write("'+b().replace(/"/g,String.fromCharCode(92)+'"')+'");d.close();'}a.P(2)};a.l&&q()})()}();c[b].lv="1";return c[b]}var o="lightningjs",k=window[o]=g(o);k.require=g;k.modules=c}({});window.wootric = lightningjs.require("wootric", "//d27j601g4x0gd5.cloudfront.net/beacon.js");window.wootric("run");
    // Wootric -- NPS Survery end

    //intercomm
    // function(){var w=window;var ic=w.Intercom;if(typeof ic==="function"){ic('reattach_activator');ic('update',intercomSettings);}else{var d=document;var i=function(){i.c(arguments)};i.q=[];i.c=function(args){i.q.push(args)};w.Intercom=i;function l(){var s=d.createElement('script');s.type='text/javascript';s.async=true;s.src='https://widget.intercom.io/widget/jqrpchg1';var x=d.getElementsByTagName('script')[0];x.parentNode.insertBefore(s,x);}if(w.attachEvent){w.attachEvent('onload',l);}else{w.addEventListener('load',l,false);}}}

    //   window.intercomSettings = {
    //     app_id: "jqrpchg1",
    //     name: "Jane Doe", // Full name
    //     email: "customer@example.com", // Email address
    //     created_at: 1312182000 // Signup date as a Unix timestamp
    //   };

    //intercomm

    $scope.getWidth = function() {
        return window.innerWidth;
    };

    $scope.$watch($scope.getWidth, function(newValue, oldValue) {
        if (newValue >= mobileView) {
            if (angular.isDefined($cookieStore.get('toggle'))) {
                $scope.toggle = ! $cookieStore.get('toggle') ? false : true;
            } else {
                $scope.toggle = true;
            }
        } else {
            $scope.toggle = false;
        }

    });

    $scope.toggleSidebar = function() {
        $scope.toggle = !$scope.toggle;
        $cookieStore.put('toggle', $scope.toggle);
    };

    window.onresize = function() {
        $scope.$apply();
    };

        $scope.$on('IdleStart', function() {
        console.log("the user appears to have gone idle");
        // the user appears to have gone idle
    });

    $scope.$on('IdleWarn', function(e, countdown) {
        console.log("the user appears to have gone idle..countdown start :"+countdown);
        // follows after the IdleStart event, but includes a countdown until the user is considered timed out
        // the countdown arg is the number of seconds remaining until then.
        // you can change the title or display a warning dialog from here.
        // you can let them resume their session by calling Idle.watch()
    });

    $scope.$on('IdleTimeout', function() {
        console.log("the user timedout");
        $rootScope.logout();
        // the user has timed out (meaning idleDuration + timeout has passed without any activity)
        // this is where you'd log them
    });

    $scope.$on('IdleEnd', function() {
        console.log("the user appears is back to work");
        // the user has come back from AFK and is doing stuff. if you are warning them, you can use this to hide the dialog
    });

    $scope.$on('Keepalive', function() {
        console.log("keep him alive");
        // do something to keep the user's session alive
    });
}