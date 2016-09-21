angular.module('app')
    .controller('ClientDashboardController', ['$scope', '$state', 'Restangular', '$rootScope', '$stateParams',
        '$timeout', '$mixpanel', '$window', '$cookieStore', 'envService', '$location', 'growl', '$http', 'Auth',
        '$uibModal', 'CustomModalService','$timeout','$cookies',
        function ($scope, $state, Restangular, $rootScope, $stateParams, $timeout, $mixpanel,
            $window, $cookieStore, envService, $location, growl, $http, Auth,$uibModal, CustomModalService,$timeout,$cookies) {
        	console.log('In ClientDashboardController : ');

        	///// LAYOUT.js code...needs to be moved back...
        	var mobileView = 992;

        	$scope.getWidth = function () {
        		return window.innerWidth;
        	};

        	$scope.$watch($scope.getWidth, function (newValue, oldValue) {
        		if (newValue >= mobileView) {
        			if (angular.isDefined($cookieStore.get('toggle'))) {
        				$scope.toggle = !$cookieStore.get('toggle') ? false : true;
        			} else {
        				$scope.toggle = true;
        			}
        		} else {
        			$scope.toggle = false;
        		}
        	});

        	$scope.toggleSidebar = function () {
        		$scope.toggle = !$scope.toggle;
        		$cookieStore.put('toggle', $scope.toggle);
        	};

        	window.onresize = function () {
        		$scope.$apply();
        	};


            // Include the UserVoice JavaScript SDK (only needed once on a page)
            UserVoice=window.UserVoice||[];(function(){var uv=document.createElement('script');uv.type='text/javascript';uv.async=true;uv.src='//widget.uservoice.com/p8mHc9uMmgPhqV9tg15s5Q.js';var s=document.getElementsByTagName('script')[0];s.parentNode.insertBefore(uv,s)})();

            //
            // UserVoice Javascript SDK developer documentation:
            // https://www.uservoice.com/o/javascript-sdk
            //

            // Set colors
            UserVoice.push(['set', {
              accent_color: '#e2753a',
              trigger_color: 'white',
              trigger_background_color: '#e2753a'
            }]);

            // Identify the user and pass traits
            // To enable, replace sample data with actual user traits and uncomment the line
            UserVoice.push(['identify', {
              //email:      'john.doe@example.com', // User’s email address
              //name:       'John Doe', // User’s real name
              //created_at: 1364406966, // Unix timestamp for the date the user signed up
              //id:         123, // Optional: Unique id of the user (if set, this should not change)
              //type:       'Owner', // Optional: segment your users by type
              //account: {
              //  id:           123, // Optional: associate multiple users with a single account
              //  name:         'Acme, Co.', // Account name
              //  created_at:   1364406966, // Unix timestamp for the date the account was created
              //  monthly_rate: 9.99, // Decimal; monthly rate of the account
              //  ltv:          1495.00, // Decimal; lifetime value of the account
              //  plan:         'Enhanced' // Plan name for the account
              //}
            }]);

            // Add default trigger to the bottom-right corner of the window:
            UserVoice.push(['addTrigger', {mode: 'contact', trigger_position: 'bottom-right' }]);

            // Or, use your own custom trigger:
            //UserVoice.push(['addTrigger', '#id', { mode: 'contact' }]);

            // Autoprompt for Satisfaction and SmartVote (only displayed under certain conditions)
            UserVoice.push(['autoprompt', {}]);

        	/////End of LAYOUT.js code...needs to be moved back...

        	$scope.newtraining = {};

        	$scope.studentcourseID = $stateParams.studentcourseID;
        	$scope.currentVideoIndex = 0;

        	$scope.state = null;
        	$scope.API = null;
        	$scope.currentVideo = 0;
        	$scope.videos = [];
        	$scope.track = {};
        	$scope.docviewer = '';
        	$scope.firstVideo = true;
        	$scope.upcomingVideos = [];
        	$scope.onboardingPrompt = 'fade';
        	$scope.coworker = {};
        	$scope.duplicateStudentCourse = '';
            $scope.showSpinner = false;
            $scope.publicTrainingURL = "";
            $scope.connectorPromo = false;
            $scope.completedVideosCount = 0;
            $scope.isFullScreen = false;
            $scope.loading = true;
            $scope.pdfUrl = "";

            $scope.scroll = 0;
            $scope.pdfloading = true;
            $scope.loadPercent = 0;
            $scope.showPlayBtn = false;
            $scope.addooIntroVideo = {};
            $scope.addooIntroVideoID = "";
            $scope.playingAddooIntroVideo = false;
            $scope.student = {};
            $scope.fadeBackground = false;

        	$scope.config = {
        		preload: "none",
        		sources: [],
        		tracks: [
                    {
                    	src: "http://www.videogular.com/assets/subs/pale-blue-dot.vtt",
                    	kind: "subtitles",
                    	srclang: "en",
                    	label: "English",
                    	default: ""
                    }
        		],
        		theme: {
        			url: "/css/videogular.css"
        		},
                plugins: {
                    controls: {
                        autoHide: true,
                        autoHideTime: 5000
                    }
                }
        	};

            var currentStateURL = $state.href($state.current.name, $state.params, {absolute: false});

            if(envService.environment != 'development') { //prod
                $scope.addooIntroVideoID = "574737eead1e62030087d9d5"; 
                $scope.staticCourseID = '';
            } else {
                $scope.addooIntroVideoID = "574736fe7262fa4f4c8fff04";
                $scope.staticCourseID = '56af988e0321ffff5db89e47';
            }

            var setWootricSettings = function() {
                 wootric_survey_immediately = true;//envService.read('wootric_survey_immediately'); // Shows survey immediately for testing purposes.  TODO: Comment out for production.
                window.wootricSettings = {
                    // modal_theme: 'dark',
                    email: $scope.studentcourse.email,// TODO: The current logged in user's email address.
                    created_at: Math.floor((new Date($scope.studentcourse.invitedOn).getTime())/1000), // TODO: The current logged in user's sign-up date as a 10 digit Unix timestamp in seconds.
                    account_token: envService.read('wootricAccountID') // This is your unique account token.
                };
                if(window.wootricSettings){i=new Image;i.src="//d8myem934l1zi.cloudfront.net/pixel.gif?account_token="+window.wootricSettings.account_token+"&email="+encodeURIComponent(window.wootricSettings.email)+"&created_at="+window.wootricSettings.created_at+"&url="+encodeURIComponent(window.location)+"&random="+Math.random()}window.lightningjs||function(c){function g(b,d){d&&(d+=(/\?/.test(d)?"&":"?")+"lv=1");c[b]||function(){var i=window,h=document,j=b,g=h.location.protocol,l="load",k=0;(function(){function b(){a.P(l);a.w=1;c[j]("_load")}c[j]=function(){function m(){m.id=e;return c[j].apply(m,arguments)}var b,e=++k;b=this&&this!=i?this.id||0:0;(a.s=a.s||[]).push([e,b,arguments]);m.then=function(b,c,h){var d=a.fh[e]=a.fh[e]||[],j=a.eh[e]=a.eh[e]||[],f=a.ph[e]=a.ph[e]||[];b&&d.push(b);c&&j.push(c);h&&f.push(h);return m};return m};var a=c[j]._={};a.fh={};a.eh={};a.ph={};a.l=d?d.replace(/^\/\//,(g=="https:"?g:"http:")+"//"):d;a.p={0:+new Date};a.P=function(b){a.p[b]=new Date-a.p[0]};a.w&&b();i.addEventListener?i.addEventListener(l,b,!1):i.attachEvent("on"+l,b);var q=function(){function b(){return["<head></head><",c,' onload="var d=',n,";d.getElementsByTagName('head')[0].",d,"(d.",g,"('script')).",i,"='",a.l,"'\"></",c,">"].join("")}var c="body",e=h[c];if(!e)return setTimeout(q,100);a.P(1);var d="appendChild",g="createElement",i="src",k=h[g]("div"),l=k[d](h[g]("div")),f=h[g]("iframe"),n="document",p;k.style.display="none";e.insertBefore(k,e.firstChild).id=o+"-"+j;f.frameBorder="0";f.id=o+"-frame-"+j;/MSIE[ ]+6/.test(navigator.userAgent)&&(f[i]="javascript:false");f.allowTransparency="true";l[d](f);try{f.contentWindow[n].open()}catch(s){a.domain=h.domain,p="javascript:var d="+n+".open();d.domain='"+h.domain+"';",f[i]=p+"void(0);"}try{var r=f.contentWindow[n];r.write(b());r.close()}catch(t){f[i]=p+'d.write("'+b().replace(/"/g,String.fromCharCode(92)+'"')+'");d.close();'}a.P(2)};a.l&&q()})()}();c[b].lv="1";return c[b]}var o="lightningjs",k=window[o]=g(o);k.require=g;k.modules=c}({});window.wootric = lightningjs.require("wootric", "//d27j601g4x0gd5.cloudfront.net/beacon.js");
            }

            $scope.launchWootricNPS = function(source) {
                if(source == 'rateus') {
                    $scope.sendEvent("Customer clicked rate us");
                }

                console.log("Trying to launch Wootric..");
                $scope.sendEvent("Trying to launch Wootric NPS");
                window.wootric("run");
            }

            var preview = ($location.search()).preview;

        	if ((Auth && Auth.user) || preview) {
        		$scope.disabletracking = true;
        	}

            $scope.sendEvent = function (event) {
                if (!$scope.disabletracking && $scope.product != 'addoo') {
                    $mixpanel.track(event, {
                        "Email": $scope.clientemail
                    });
                }
            };

            var playIntroVideo = function() {
                Restangular.one("video",$scope.addooIntroVideoID).get().then(function (data) {
                    $scope.addooIntroVideo = data;
                    //$scope.playVideo($scope.currentVideoIndex);
                    $scope.config.sources = [{src: $scope.addooIntroVideo.url, type: "video/mp4"}];
                    $timeout($scope.API.play.bind($scope.API), 100);
                    $scope.sendEvent("Playing Addoo Intro Video");
                });
            }

            $scope.openClientModal = function (targetTemplateURL) {
                $scope.clientModalInstance = $uibModal.open({
                  animation     : true,
                  templateUrl   : targetTemplateURL,
                  scope         : $scope
                });
            };

            $scope.closeClientModal = function () {
                $scope.clientModalInstance.dismiss('cancel');
            };

            var processOnboarding = function() {
                Restangular.one("studentcourses/" + $scope.studentcourseID + "?populate=courseID&populate=studentID&populate=onboardingSpecialist").get().then(function (data) {
                    $scope.studentcourse = data;
                    $scope.clientemail = data.email;
                    $scope.product = data.product;
                    $scope.sendEvent("Customer viewed onboarding track");

                    if ($scope.studentcourse.visitCount) {
                        $scope.studentcourse.visitCount = $scope.studentcourse.visitCount + 1;
                    } else {
                        $scope.studentcourse.visitCount = 1;
                    }

                    if (!$scope.studentcourse.progress || $scope.studentcourse.progress == 'invited') {
                        $scope.studentcourse.progress = "viewed";
                        if (!$scope.disabletracking) {
                            $scope.studentcourse.put();
                        }
                    }
                    setProductDisplayName();
                    // if($scope.studentcourse.product == 'sharefile' && $scope.studentcourse.visitCount == 1) {
                    //   playIntroVideo();  
                    //   $scope.playingAddooIntroVideo = true;
                    // } else {
                      $scope.playVideo($scope.currentVideoIndex);  
                      $scope.playingAddooIntroVideo = false;
                    // }
                    getUpcomingVideos();
                    updateViewStatus();
                    setPublicTraningURL();
                    $scope.studentcourse.displayProductName = $scope.displayProductName($scope.studentcourse.product);
                    setWootricSettings();
                    if($scope.studentcourse.studentID.sc && $scope.studentcourse.studentID.sc.productType == "sfsc") {
                        $scope.connectorPromo = true; //enabling connector promo
                    }
                    $scope.loading = false;
                    console.log("Setting loading to false ***");
                    if($scope.studentcourse.product == 'sharefile' && $scope.studentcourse.industry && 
                        ($scope.studentcourse.industry != 'Healthcare' ||  $scope.studentcourse.industry != 'Financial')) {
                            $scope.showSFPromotedVideo = true;
                    }
                    //dirty quick fix
                    if($scope.studentcourse.product == 'solano' || $scope.studentcourse.product == 'cloudstrong') {
                        var body =  document.getElementsByTagName("BODY")[0];
                        body.style.backgroundColor = "#fff";

                        var header = document.getElementsByClassName("client-header")[0];
                        header.style.backgroundColor = "#002e5d";

                        var customerInfo = document.getElementsByClassName("customerInformation")[0];
                        customerInfo.style.height = "40px";
                        customerInfo.style.border = "none";
                        customerInfo.style.backgroundColor = "#f1f1f1";

                        var customerInfoH5 = document.getElementByClassName("customerInformation")[0].getElementsByTagName("h5")[0];
                        customerInfo.style.color = "#545454";

                    }
                });
            }

            if(currentStateURL == '#/onboarding/dashboard/sharefile') {
                $scope.sendEvent("Visit via static url");
                if($cookies.get('onboardingToken')) {
                    $scope.sendEvent("Customer returned to static url via cookie");
                    $scope.studentcourseID = $cookies.get('onboardingToken');
                    processOnboarding();
                    $scope.fadeBackground = false;
                } else {
                    $scope.openClientModal('templates/modals/ClientDetailsModal.html');
                    $scope.fadeBackground = true;
                }
            } else {
                processOnboarding();
            }

            $scope.getCustomerTraining = function() {
                var trackParams = {};
                trackParams.email = $scope.student.local.email;
                trackParams.firstname = $scope.student.local.firstname;
                trackParams.lastname = $scope.student.local.lastname;
                Restangular.all('singleonboarding').post(trackParams).then(function (data) {
                    console.log("Setting cookie :"+data.studentCourseID);
                    $cookies.put('onboardingToken',data.studentCourseID);
                    console.log("Get put cookie :"+$cookies.get('onboardingToken'));
                    $scope.fadeBackground = false;
                    $scope.studentcourseID = data.studentCourseID;
                    $scope.closeClientModal();
                    processOnboarding();
                    console.log("Got data :"+JSON.stringify(data));
                });
            }

            var setPublicTraningURL = function() {
                if($scope.studentcourse.product == 'sharefile' || $scope.studentcourse.product == 'sharefile-presales'
                    || $scope.studentcourse.product == 'sharefile-lifecycle') {
                    $scope.publicTrainingURL = "https://attendee.gototraining.com/rt/732020008678591744";
                } else if($scope.studentcourse.product == 'shareconnect') {
                    $scope.publicTrainingURL = "https://attendee.gotowebinar.com/rt/41719141899018498";
                } else if($scope.studentcourse.product == 'rightsignature') {
                    $scope.publicTrainingURL = "https://attendee.gototraining.com/rt/6022988730695539458";
                }
            }

        	var setProductDisplayName = function () {
        		if ($scope.studentcourse.product == "sharefile" || $scope.studentcourse.product == 'sharefile-presales' 
                    || $scope.studentcourse.product == 'sharefile-lifecycle')
        			$scope.productDisplayName = "ShareFile";
        		else if ($scope.studentcourse.product == "shareconnect")
        			$scope.productDisplayName = "ShareConnect";
        		else if ($scope.studentcourse.product == "rightsignature")
        			$scope.productDisplayName = "RightSignature";
        		else if ($scope.studentcourse.product == "addoo")
        			$scope.productDisplayName = "Addoo";
        		else if ($scope.studentcourse.product == "podio" || $scope.studentcourse.product == "podio-postsales")
        			$scope.productDisplayName = "Podio";
                else if ($scope.studentcourse.product == "bollo")
                    $scope.productDisplayName = "Bollo Empire";
                else if ($scope.studentcourse.product == "demo")
                    $scope.productDisplayName = "Demo";
                else if ($scope.studentcourse.product == "solano")
                    $scope.productDisplayName = "SolanoLabs";
                else if ($scope.studentcourse.product == "cloudstrong")
                    $scope.productDisplayName = "CloudStrong";
        	}

            if (($location.search()).org == "mt") {
                console.log("Viewing via marketo email");
                $scope.sendEvent('Visit via Marketo email');
            } 

            if (($location.search()).src == "welcomeemail" || ($location.search()).src == "SFRS4welcomeemail" 
                || ($location.search()).src == "SFwelcomeemail") {
        		console.log("Viewing via welcome email");
        		$scope.sendEvent('Visit via Welcome Email');
        	} else if (($location.search()).src == "welcomeemail2") {
                console.log("Viewing via followup welcome email");
                $scope.sendEvent('Viewing via followup welcome email');
            } else if (($location.search()).src == "coworkerreferral") {
        		console.log("Viewing via coworker referral email");
        		$scope.sendEvent('Visit via Coworker referral');
        	}

        	var getUpcomingVideos = function () {
        		$scope.studentcourse.courseID.contents.forEach(function (element, index, array) {
        			Restangular.one("video", element.videoID).get().then(function (data) {
        				element.videourl = data.url;
        				element.posterurl = data.posterurl;
        				element.duration = data.duration;
                        element.displaytitle = data.displaytitle;
                        element.displayProductName = $scope.displayProductName(data.product);
        			});

        			//updating progress of each video too
        			$scope.studentcourse.lessonprogress.forEach(function (progresselement, index1, array1) {
        				if (element.videoID == progresselement.lessonID) {
        					element.progress = progresselement.progress;
        				}
        			});
        		});

                $scope.studentcourse.courseID.documents.forEach(function (element, index, array) {
                    Restangular.one("video", element.videoID).get().then(function (data) {
                        element.videourl = data.url;
                        element.posterurl = data.posterurl;
                        element.duration = data.duration;
                        element.displaytitle = data.displaytitle;
                        element.displayProductName = $scope.displayProductName(data.product);
                    });

                    //updating progress of each video too
                    $scope.studentcourse.lessonprogress.forEach(function (progresselement, index1, array1) {
                        if (element.videoID == progresselement.lessonID) {
                            element.progress = progresselement.progress;
                        }
                    });
                });
        	}

        	$scope.onPlayerReady = function (API) {
        		console.log(" Player ready :" + API);
        		$scope.API = API;
        		console.log($window.navigator.userAgent);

        		// only seeking time for chrome as firefox has issues wen doing this
        		if ($window.navigator.userAgent.indexOf("Chrome/") > -1) {
        			$scope.API.seekTime(1);
                    $scope.showPlayBtn = true;
        		}
        	};


        	$scope.setVideo = function (index) {
        		$scope.API.stop();
        		$scope.currentVideo = index;
        		$scope.config.sources = $scope.videos[index].sources;
        		$scope.config.plugins = {};
        		$scope.config.plugins.poster = $scope.videos[index].posterurl;

        		$timeout($scope.API.play.bind($scope.API), 100);
        	};

        	$scope.startVideo = function () {
        		console.log(" Player ready :" + $scope.API);
        		$scope.showVideoPlayer = true;
        		$scope.API.play();
        	}

        	$scope.playVideo = function (index) {
        		console.log("Playing video :" + index);

        		Restangular.one("video", $scope.studentcourse.courseID.contents[index].videoID).get().then(function (data) {
        			$scope.video = data;
                    $scope.pdfUrl = data.url;

        			var videolist = [];
        			var videosource = { src: $scope.video.url, type: "video/mp4" };
        			var videoposterlist = [];
        			var postersource = $scope.video.posterurl;

        			videolist.push(videosource);

        			if ($scope.videos.length < index) {
        				for (i = $scope.videos.length; i < index; i++) {
        					$scope.videos.push("");
        				}
        			}

        			if (!$scope.videos[index] || $scope.videos[index] == "") {
        				$scope.videos.splice(index, 1);
        				$scope.videos.splice(index, 0, { sources: videolist, posterurl: $scope.video.posterurl });
        			}

        			$scope.videos.plugins = {};
        			$scope.videos.plugins.poster = {};
        			$scope.videos.plugins.poster.url = $scope.video.posterurl;

        			if (index != 0)
        				$scope.setVideo(index);
        			else if ($scope.playingAddooIntroVideo && index == 0) {
                        $scope.setVideo(index);
                    } else {
        				$scope.config.sources = $scope.videos[index].sources;
        				$scope.config.plugins = $scope.videos[index].plugins;
        			}
        			$scope.currentVideoIndex = index;
        		});
        	};

            $scope.showDoc = function (index) {
                console.log("Showing Document :" + index);

                Restangular.one("video", $scope.studentcourse.courseID.documents[index].videoID).get().then(function (data) {
                    $scope.sendEvent("Customer vieweing document");
                    $scope.video = data;
                    $scope.pdfUrl = data.url;

                    var videolist = [];
                    var videosource = { src: $scope.video.url, type: "video/mp4" };
                    var videoposterlist = [];
                    var postersource = $scope.video.posterurl;

                    videolist.push(videosource);

                    if ($scope.videos.length < index) {
                        for (i = $scope.videos.length; i < index; i++) {
                            $scope.videos.push("");
                        }
                    }

                    if (!$scope.videos[index] || $scope.videos[index] == "") {
                        $scope.videos.splice(index, 1);
                        $scope.videos.splice(index, 0, { sources: videolist, posterurl: $scope.video.posterurl });
                    }

                    $scope.videos.plugins = {};
                    $scope.videos.plugins.poster = {};
                    $scope.videos.plugins.poster.url = $scope.video.posterurl;

                    if (index != 0)
                        $scope.setVideo(index);
                    else {
                        $scope.config.sources = $scope.videos[index].sources;
                        $scope.config.plugins = $scope.videos[index].plugins;
                    }
                    $scope.currentVideoIndex = index;
                });
            };

        	$scope.playNextVideo = function () {
        		$scope.sendEvent("Customer playing next video");
        		var videoIndex = $scope.currentVideoIndex + 1;
        		if ($scope.studentcourse.courseID.contents[videoIndex].type != 'document')
        			$scope.playVideo(videoIndex);
        		else {
        			Restangular.one("video", $scope.studentcourse.courseID.contents[videoIndex].videoID).get().then(function (data) {
        				$scope.documenturl = data.url;
        				$scope.track.type = "document";
        				$scope.docviewer = 'active';
        				console.log("Document URL :" + $scope.documenturl);
        			});
        		}
        	};

        	$scope.playPreviousVideo = function () {
        		$scope.sendEvent("Customer playing previous video");
        		$scope.playVideo($scope.currentVideoIndex - 1);
        	};

        	$scope.updateVideoTime = function ($currentTime, $duration) {
        		if ($currentTime * 100 / $duration > 80) {
        			$scope.updateVideoProgress("complete");
        		} else if ($currentTime > 2) {
        			$scope.updateVideoProgress("started");
        		}

                if($scope.API.isFullScreen != $scope.isFullScreen) {
                    $scope.isFullScreen = $scope.API.isFullScreen;
                    if($scope.isFullScreen){
                        $scope.sendEvent("Playing in fullscreen mode now");
                    } else {
                        $scope.sendEvent("Playing in normal mode now");
                    }
                }
        	};

        	$scope.onCompleteVideo = function () {
                if(!$scope.video) {
                    return true;
                }
        		console.log("Video completed... :");
                $scope.counter = 2;
                console.log("Video Index :"+$scope.currentVideoIndex);
                if($scope.currentVideoIndex != $scope.studentcourse.courseID.contents.length-1) {
                    //$scope.openAutoPlayModal();
                    if($scope.video && !$scope.video.promoted && !$scope.video.sfpromoted) { // not autoplaying for connector promo video
                        $scope.countdown();
                    }
                }

                $scope.completedVideosCount = $scope.completedVideosCount + 1;

                console.log("Completed videos : "+$scope.completedVideosCount+" ; "+$scope.video+" ; ");
                if($scope.completedVideosCount == 1) { //launching only after completing 1st video
                    $scope.launchWootricNPS('videocompletion');
                }
                if($scope.video._id == envService.read('connectorVideoID') && $scope.connectorPromo){
                    var rafflecontestant = {};
                    console.log("Student ID :"+JSON.stringify($scope.studentcourse.studentID));
                    rafflecontestant.user = $scope.studentcourse.studentID._id;
                    rafflecontestant.email = $scope.studentcourse.studentID.local.email;
                    rafflecontestant.studentCourse = $scope.studentcourse._id;
                    rafflecontestant.product = $scope.studentcourse.product;
                    Restangular.all('rafflecontestant').post(rafflecontestant).then(function (data) {
                        console.log("Raffle entry posted");
                    });

                    if($scope.video && $scope.video.promoted) {
                        launchModal('templates/modals/ConnectorPromoModal.html');
                    }
                } else if($scope.video._id == envService.read('sfPromotedVideoID')) {
                    if($scope.video && $scope.video.sfpromoted) {
                        console.log("Launching promo modal");
                        $scope.sendEvent("Completed SF Promoted video");
                        launchModal('templates/modals/SFPromoModal.html');
                    } 
                }
        	};

            var launchModal = function(modalurl) {
                $scope.openClientModal(modalurl);
            }

            $scope.isFullScreen = function() {
                
            }

        	var launchOnboardingPrompt = function () {
        		$scope.sendEvent("Showing onboarding prompt");
        		$scope.onboardingPrompt = "show";
        	};

        	$scope.turnOffOnboardingPrompt = function () {
        		$scope.sendEvent("Customer viewed onboarding track");
        		$scope.onboardingPrompt = "fade";
        	}

        	$scope.sendStatusEvent = function (status) {
        		if (status == 'started') {
                    console.log("Customer playing video");
        			$scope.sendEvent("Customer playing video");
        		} else if (status == 'complete') {
        			$scope.sendEvent("Customer completed a video");
        		}
        	}

        	$scope.updateVideoProgress = function (status) {
                if(!$scope.video) {
                    return true;
                }

        		var progressAdded = false;
        		var pushupdate = true;
        		if (!$scope.studentcourse.lessonprogress || $scope.studentcourse.lessonprogress.length == 0) {
        			$scope.studentcourse.lessonprogress.push({ lessonID: $scope.video._id, progress: status });
        			$scope.sendStatusEvent(status);
        		} else {
        			$scope.studentcourse.lessonprogress.forEach(function (element, index, array) {
        				if (element.lessonID === $scope.video._id) {
        					progressAdded = true;
        					if (status != element.progress && element.progress != 'complete') {
                                var startedOn = element.startedOn;
        						$scope.studentcourse.lessonprogress.splice(index, 1);
        						$scope.studentcourse.lessonprogress.push({ lessonID: $scope.video._id, progress: status, startedOn : startedOn });
        						console.log("Video lesson marked " + status);
        						$scope.sendStatusEvent(status);
        						if (status == 'started') {
        							$scope.studentcourse.lessonprogress[index].startEventSent = true;
        						} else if (status == 'complete') {
        							$scope.studentcourse.lessonprogress[index].completeEventSent = true;
        						}
        					} else {
        						if (!element.startEventSent && status == 'started') {
        							$scope.sendStatusEvent(status);
        							element.startEventSent = true;
        						} else if (!element.completeEventSent && status == 'complete') {
        							$scope.sendStatusEvent(status);
        							element.completeEventSent = true;
        						}
        						pushupdate = false;
        					}
        				}
        			});

        			if (!progressAdded) {
        				$scope.studentcourse.lessonprogress.push({ lessonID: $scope.video._id, progress: status });

        			}
        		}
        		if (pushupdate && !$scope.disabletracking) {
                    $scope.studentcourse.updatedLessonID = $scope.video._id;
                    $scope.studentcourse.updatedLessonprogress = status;
        			$scope.studentcourse.put();
                    // video watched count tracking
                    if(status == 'started') {
                        $scope.video.startedCount = $scope.video.startedCount ? $scope.video.startedCount + 1 : 1;
                    } else if(status == 'complete') {
                        $scope.video.completedCount = $scope.video.completedCount ? $scope.video.completedCount + 1 : 1;
                    }
                    $scope.video.put();
        		}
        	};

        	$scope.addCoworker = function () {
        		console.log("Adding coworker");
        		var emailParams = {};
                $scope.showSpinner = true;
        		emailParams.coworker = {};
        		emailParams.coworker.email = $scope.coworker.email;
        		emailParams.coworker.referredBy = $scope.studentcourse.studentID._id;
        		emailParams.coworker.urlPrefix = "https://app.addoo.io/index.html#/client/dashboard/v2/";
        		emailParams.coworker.studentCourseID = $scope.studentcourse._id;
        		emailParams.coworker.product = $scope.studentcourse.product;
        		emailParams.coworker.referralname = $scope.studentcourse.studentID.local.firstname + " " + $scope.studentcourse.studentID.local.lastname;
        		emailParams.coworker.referralemail = $scope.studentcourse.studentID.local.email;

        		Restangular.all('sharewithfriend').post(emailParams).then(function (user) {
        			growl.success('Shared with ' + $scope.coworker.email + " successfully.");
        			console.log("Shared with friend successfully");
                    $scope.coworker.email = "";
                    $scope.showSpinner = false;
        		});
        		$scope.sendEvent('Shared with coworker');
        	}

        	$scope.bookmark = function () {
        		var bookmarkTitle = $scope.studentcourse.product + " training portal";
        		if ($window.sidebar && $window.sidebar.addPanel) { // Mozilla Firefox Bookmark
        			$window.sidebar.addPanel(bookmarkTitle, $window.location.href, '');
        		} else if ($window.external && ('AddFavorite' in $window.external)) { // IE Favorite
        			$window.external.AddFavorite(location.href, bookmarkTitle);
        		} else if ($window.opera && $window.print) { // Opera Hotlist
        			this.title = bookmarkTitle;
        			return true;
        		} else { // webkit - safari/chrome
        			alert('Press ' + ($window.navigator.userAgent.toLowerCase().indexOf('mac') != -1 ? 'Command/Cmd' : 'CTRL') + ' + D to bookmark this page.');
        		}
        		$scope.sendEvent('Bookmark Link Clicked');
        		return true;
        	}

            $scope.trackevent = function(event) {
                console.log("Event received");
                if(!$scope.disabletracking){                 
                    var lead = {};
                    lead.product = event;
                    lead.studentCourseID = $scope.studentcourseID;
                    $mixpanel.track("Customer clicked other products", {
                            "Email": $scope.clientemail,
                            "Product" : event
                    });
                    Restangular.all('crosssaleleads').post(lead);
                }
            }

            $scope.like = function(like) {
                if(like) {
                    console.log("Customer liked the video");
                    $scope.video.likes = $scope.video.likes + 1;
                    $scope.sendEvent("Customer liked a video");
                } else {
                    console.log("Customer disliked the video");
                    $scope.video.dislikes = $scope.video.dislikes + 1;
                    $scope.sendEvent("Customer disliked a video");
                }
                $scope.video.put();
            }

            var updateViewStatus = function() {
                if(!$scope.studentcourse.lessonprogress || $scope.studentcourse.lessonprogress.length == 0) {
                    return true;
                }
                
                for(var i=0;i < $scope.studentcourse.courseID.contents.length;i++) {
                    var coursecontent = $scope.studentcourse.courseID.contents[i];
                    for(var j = 0; j < $scope.studentcourse.lessonprogress.length; j++) {
                        var studentcoursecontent = $scope.studentcourse.lessonprogress[j];
                        if(coursecontent.videoID == studentcoursecontent.lessonID) {
                            $scope.studentcourse.courseID.contents[i].progress = studentcoursecontent.progress;
                        }
                    }
                }
            }

            $scope.openSupportModal = function() {
                $scope.openClientModal('templates/modals/SupportModal.html');
            }

            $scope.displayProductName = function(product) {
                console.log("Got :"+product);
                var displayProductName = "";
                if(product == 'sharefile' || product == 'sharefile-presales' || product == 'sharefile-lifecycle') {
                    displayProductName = 'ShareFile';
                } else if(product == 'shareconnect') {
                    displayProductName = 'ShareConnect';
                } else if(product == 'rightsignature') {
                    displayProductName = 'RightSignature';
                } else if(product == 'bollo') {
                    displayProductName = 'BolloEmpire'
                }
                console.log('returning :'+displayProductName)
                return displayProductName;
            }

            $scope.autoPlay = function() {
                $scope.sendEvent("Auto playing video");
                $scope.playVideo($scope.currentVideoIndex+1);
            }

            $scope.countdown = function() {
                stopped = $timeout(function() {
                 $scope.counter--;
                 if($scope.counter == 0) {
                    $scope.autoPlay();
                    $scope.closeAutoPlayModal();
                 } else if($scope.counter > 0){
                    $scope.countdown();      
                 } else {
                    $scope.stop();
                 }  
                }, 1000);
              };
                
            $scope.stop = function(){
                $timeout.cancel(stopped);
            } 

            $scope.openAutoPlayModal = function () {
                console.log("Opening modal");
                $scope.autoPlayModalInstance = $uibModal.open({
                  animation     : true,
                  templateUrl   : 'templates/modals/AutoPlayModal.html',
                  scope         : $scope
                });
            };

            $scope.closeAutoPlayModal = function () {
                if($scope.autoPlayModalInstance) {
                    $scope.autoPlayModalInstance.dismiss('cancel');
                }
            };

            $scope.playSCConnector = function() {
                console.log("Am here");
                var connectorVideoID = envService.read('connectorVideoID'); //"56ba0db731d3360300643f19";
                Restangular.one("video", connectorVideoID).get().then(function (data) {
                    $scope.video = data;
                    $scope.video.promoted = true;
                    $scope.config.sources = [{src: $scope.video.url, type: "video/mp4"}];
                    $timeout($scope.API.play.bind($scope.API), 100);
                });
            }

            $scope.playSFPromotedVideo = function() {
                var connectorVideoID = envService.read('sfPromotedVideoID'); //"56ba0db731d3360300643f19";
                Restangular.one("video", connectorVideoID).get().then(function (data) {
                    $scope.video = data;
                    $scope.video.sfpromoted = true;
                    $scope.config.sources = [{src: $scope.video.url, type: "video/mp4"}];
                    $timeout($scope.API.play.bind($scope.API), 100);
                    $scope.sendEvent("Playing SF Promoted Video");
                });
            }

            $scope.requestedContact = function() {
                $scope.contactConfirmationMsg = true;
                var lead = {};
                lead.product = $scope.studentcourse.product;
                if(lead.product == 'shareconnect') {
                    lead.feature = "connector";
                    lead.studentCourseID = $scope.studentcourseID;
                    $mixpanel.track("Sending Connector Lead Email", {
                            "Email": $scope.clientemail,
                            "Product" : event
                    });
                } else if(lead.product == 'sharefile') {
                    lead.feature = "approval-workflow";
                    lead.studentCourseID = $scope.studentcourseID;
                    lead.salesRep = envService.read('sfPromotedVideoContactId');
                    lead.salesRepEmail = envService.read('sfPromotedVideoContactEmail');

                    $mixpanel.track("Sending SF Promoted Video Lead Email", {
                            "Email": $scope.clientemail,
                            "Product" : event
                    });
                }
                    Restangular.all('crosssaleleads').post(lead);

            }
                    
            $scope.getNavStyle = function(scroll) {
                if(scroll > 100) return 'pdf-controls fixed';
                else return 'pdf-controls';
            }

            $scope.onError = function(error) {
                $scope.sendEvent("Error loading PDF document");
                console.log(error);
            }

            $scope.onLoad = function() {
                $scope.pdfloading = false;
                $scope.sendEvent("Document loaded successfully");
            }

            $scope.onProgress = function(progress) {
                $scope.loadPercent = progress.loaded * 100 / progress.total;
                console.log($scope.loadPercent);
            }

            $scope.previousPage = function(){
                console.log("User clicked previous page");
                $scope.sendEvent("User clicked previous page");
            }

            $scope.nextPage = function(){
                console.log("User clicked next page");
                $scope.sendEvent("User clicked next page");
            }            

            $scope.downloadDoc = function() {
                console.log("User downloading document");
                $scope.sendEvent("User downloading document");
            }

        }]);
