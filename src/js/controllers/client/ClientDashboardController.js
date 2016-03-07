angular.module('app')
    .controller('ClientDashboardController', ['$scope', '$state', 'Restangular', '$rootScope', '$stateParams',
        '$timeout', '$mixpanel', '$window', '$cookieStore', 'envService', '$location', 'growl', '$http', 'Auth',
        function ($scope, $state, Restangular, $rootScope, $stateParams, $timeout, $mixpanel,
            $window, $cookieStore, envService, $location, growl, $http, Auth) {
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
        		}
        	};

        	if (Auth && Auth.user) {
        		$scope.disabletracking = true;
        	}

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
        		$scope.playVideo($scope.currentVideoIndex);
        		getUpcomingVideos();
        	});

        	var setProductDisplayName = function () {
        		if ($scope.studentcourse.product == "sharefile")
        			$scope.productDisplayName = "ShareFile";
        		else if ($scope.studentcourse.product == "shareconnect")
        			$scope.productDisplayName = "ShareConnect";
        		else if ($scope.studentcourse.product == "rightsignature")
        			$scope.productDisplayName = "RightSignature";
        		else if ($scope.studentcourse.product == "addoo")
        			$scope.productDisplayName = "Addoo";
        		else if ($scope.studentcourse.product == "podio")
        			$scope.productDisplayName = "Podio";
                else if ($scope.studentcourse.product == "bollo")
                    $scope.productDisplayName = "Bollo Empire";
                else if ($scope.studentcourse.product == "demo")
                    $scope.productDisplayName = "Demo";
        	}

        	$scope.sendEvent = function (event) {
        		if (!$scope.disabletracking && $scope.product != 'addoo') {
        			$mixpanel.track(event, {
        				"Email": $scope.clientemail
        			});
        		}
        	};

        	if (($location.search()).src == "welcomeemail") {
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
        		console.log(" Player ready :" + API);
        		$scope.showVideoPlayer = true;
        		$scope.API.play();
        	}

        	$scope.playVideo = function (index) {
        		console.log("Playing video :" + index);

        		Restangular.one("video", $scope.studentcourse.courseID.contents[index].videoID).get().then(function (data) {
        			$scope.video = data;

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
        	};

        	$scope.onCompleteVideo = function () {
        		if ($scope.currentVideoIndex == 2) {
        			console.log("Launching onboarding prompt");
        			launchOnboardingPrompt();
        		}
        		console.log("Video completed... :");
        	};

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
        			$scope.sendEvent("Customer playing video");
        		} else if (status == 'complete') {
        			$scope.sendEvent("Customer completed a video");
        		}
        	}

        	$scope.updateVideoProgress = function (status) {
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
        			$scope.studentcourse.put().then(function(data){
                        $scope.studentcourse = data;
                    });
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
        		emailParams.coworker = {};
        		emailParams.coworker.email = $scope.coworker.email;
        		emailParams.coworker.referredBy = $scope.studentcourse.studentID._id;
        		emailParams.coworker.urlPrefix = "http://app.addoo.io/index.html#/client/dashboard/";
        		emailParams.coworker.studentCourseID = $scope.studentcourse._id;
        		emailParams.coworker.product = $scope.studentcourse.product;
        		emailParams.coworker.referralname = $scope.studentcourse.studentID.local.firstname + " " + $scope.studentcourse.studentID.local.lastname;
        		emailParams.coworker.referralemail = $scope.studentcourse.studentID.local.email;

        		Restangular.all('sharewithfriend').post(emailParams).then(function (user) {
        			growl.success('Shared with ' + $scope.coworker.email + " successfully.");
        			console.log("Shared with friend successfully");
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

        }]);
