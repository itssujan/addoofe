angular.module('app')
    .controller('ClientDashboardController', [ '$scope', '$state','Restangular', '$rootScope','$stateParams',
        '$timeout','$mixpanel','$window','$cookieStore','envService','$location','growl','$http',
        function ($scope, $state, Restangular,$rootScope, $stateParams, $timeout,$mixpanel,
            $window,$cookieStore,envService,$location,growl,$http) {
            console.log('In ClientDashboardController : ');

            ///// LAYOUT.js code...needs to be moved back...
            var mobileView = 992;

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
                    url: "http://www.videogular.com/styles/themes/default/latest/videogular.css"
                }
            };

            var json = 'http://ipv4.myexternalip.com/json';

            Restangular.one("getrestrictedip").get().then(function(data){
                var restrictedIP = data.ip;
                $http.get(json,{withCredentials:false}).then(function(result) {
                    var clientIP = result.data.ip;
                    if(clientIP.indexOf(restrictedIP) >= 0){
                        console.log("Disabling tracking");
                        $scope.disabletracking = true;
                    }
                    },function(e) {
                        console.log("Error getting ip :"+e);
                });
            });

            Restangular.one("studentcourses/"+$scope.studentcourseID+"?populate=courseID&populate=studentID&populate=onboardingSpecialist").get().then(function(data){
                $scope.studentcourse = data;
                $scope.clientemail = data.email;
                $scope.sendEvent("Customer viewed onboarding track");
                if($scope.studentcourse.visitCount){
                    $scope.studentcourse.visitCount = $scope.studentcourse.visitCount + 1;
                } else {
                    $scope.studentcourse.visitCount = 1;
                }
                if(!$scope.studentcourse.progress || $scope.studentcourse.progress == 'invited'){
                    $scope.studentcourse.progress = "viewed";
                    if(!$scope.disabletracking){
                        $scope.studentcourse.put();
                    }
                }
                $scope.playVideo($scope.currentVideoIndex);
                getUpcomingVideos();
            });

            $scope.sendEvent = function(event){
                if(!$scope.disabletracking){
                    $mixpanel.track(event, {
                        "Email": $scope.clientemail
                    });
                }
            };

            if(($location.search()).src == "welcomeemail"){
                console.log("Viewing via welcome email");
                $scope.sendEvent('Visit via Welcome Email');
            } else if(($location.search()).src == "coworkerreferral"){
                console.log("Viewing via coworker referral email");
                $scope.sendEvent('Visit via Coworker referral');
            }

            var getUpcomingVideos = function() {
                $scope.studentcourse.courseID.contents.forEach(function(element, index, array) {
                    Restangular.one("video", element.videoID).get().then(function(data){
                            element.videourl = data.url;
                            element.posterurl = data.posterurl;   
                            element.duration  = data.duration;
                        });

                    //updating progress of each video too
                    $scope.studentcourse.lessonprogress.forEach(function(progresselement, index1, array1){
                        if(element.videoID == progresselement.lessonID){
                            element.progress = progresselement.progress;
                        }
                    });
                });
            }

            $scope.onPlayerReady = function(API) {
                console.log(" Player ready :"+API);
                $scope.API = API;
                console.log($window.navigator.userAgent);
                //only seeking time for chrome as firefox has issues wen doing this
                if($window.navigator.userAgent.indexOf("Chrome/") > -1){
                    $scope.API.seekTime(1);
                }
            };  


            $scope.setVideo = function(index) {
                $scope.API.stop();
                $scope.currentVideo = index;
                $scope.config.sources = $scope.videos[index].sources;
                $scope.config.plugins = {};
                $scope.config.plugins.poster = $scope.videos[index].posterurl;

                $timeout($scope.API.play.bind($scope.API), 100);
            };

            $scope.startVideo = function() {
                console.log(" Player ready :"+API);
                $scope.showVideoPlayer = true;
                $scope.API.play();
            }

            $scope.playVideo = function(index) { 
                console.log("Playing video :"+index);
                Restangular.one("video", $scope.studentcourse.courseID.contents[index].videoID).get().then(function(data){
                    $scope.video = data;
                    var videolist = [];
                    var videosource = {src : $scope.video.url, type: "video/mp4"};
                    var videoposterlist = [];
                    var postersource = $scope.video.posterurl;
                    //$scope.config.sources.push({src : $scope.video.url, type: "video/mp4"});
                    videolist.push(videosource);
                    $scope.videos.push({sources : videolist, posterurl : $scope.video.posterurl});
                    $scope.videos.plugins = {};
                    $scope.videos.plugins.poster = {};
                    $scope.videos.plugins.poster.url = $scope.video.posterurl;

                    if(index != 0)
                        $scope.setVideo(index);
                    else{
                        $scope.config.sources = $scope.videos[index].sources;
                        $scope.config.plugins = $scope.videos[index].plugins;
                    }
                    $scope.currentVideoIndex = index;
                });
            };

            $scope.playNextVideo = function(){
                $scope.sendEvent("Customer playing next video");
                var videoIndex = $scope.currentVideoIndex + 1;
                if($scope.studentcourse.courseID.contents[videoIndex].type != 'document' )
                    $scope.playVideo(videoIndex);
                else{
                    Restangular.one("video", $scope.studentcourse.courseID.contents[videoIndex].videoID).get().then(function(data){
                        $scope.documenturl = data.url;
                        $scope.track.type = "document";
                        $scope.docviewer = 'active';
                        console.log("Document URL :"+$scope.documenturl);
                    });    
                }   
            };

            $scope.playPreviousVideo = function(){
                $scope.sendEvent("Customer playing previous video");
                $scope.playVideo($scope.currentVideoIndex-1);
            };

            $scope.updateVideoTime = function($currentTime, $duration){
                if($currentTime*100/$duration > 80){
                    $scope.updateVideoProgress("complete");
                } else if($currentTime > 2 ) {
                    $scope.updateVideoProgress("started");
                }
            };

            $scope.onCompleteVideo = function(){
                if($scope.currentVideoIndex == 2){
                    console.log("Launching onboarding prompt");
                    launchOnboardingPrompt();
                }
                console.log("Video completed... :");
            };

            var launchOnboardingPrompt   = function() {
                $scope.sendEvent("Showing onboarding prompt");
                $scope.onboardingPrompt = "show";
            };

            $scope.turnOffOnboardingPrompt = function() {
                $scope.sendEvent("Customer viewed onboarding track");
                $scope.onboardingPrompt = "fade";
            }

            $scope.updateVideoProgress = function(status){
                var progressAdded = false;
                var pushupdate = true;
                if (!$scope.studentcourse.lessonprogress || $scope.studentcourse.lessonprogress.length == 0) {
                    $scope.studentcourse.lessonprogress.push({lessonID : $scope.video._id, progress : status});
                } else {
                    $scope.studentcourse.lessonprogress.forEach(function(element, index, array) {
                        if(element.lessonID === $scope.video._id){
                            progressAdded = true;
                            if(status != element.progress) {
                                $scope.studentcourse.lessonprogress.splice(index, 1);
                                $scope.studentcourse.lessonprogress.push({lessonID : $scope.video._id, progress : status});  
                                console.log("Video lesson marked "+status);
                                if(status == 'started'){
                                    $scope.sendEvent("Customer playing video");
                                } else if(status == 'complete'){
                                    $scope.sendEvent("Customer completed a video");
                                }
                            } else {
                                pushupdate = false;
                            }
                        } 
                    });

                    if(!progressAdded){
                        $scope.studentcourse.lessonprogress.push({lessonID : $scope.video._id, progress : status});

                    }
                }
                if (pushupdate && !$scope.disabletracking) {
                    $scope.studentcourse.put();
                }
            };


            $scope.addCoworker = function(){
                console.log("Adding coworker");
                var emailParams = {};
                emailParams.coworker = {};
                emailParams.coworker.email = $scope.coworker.email;
                emailParams.coworker.referredBy = $scope.studentcourse.studentID._id;
                emailParams.coworker.urlPrefix = "http://app.addoo.io/index.html#/client/dashboard/";
                emailParams.coworker.studentCourseID = $scope.studentcourse._id;
                emailParams.coworker.product = $scope.studentcourse.product;
                emailParams.coworker.referralname = $scope.studentcourse.studentID.local.firstname +" "+ $scope.studentcourse.studentID.local.lastname;
                emailParams.coworker.referralemail = $scope.studentcourse.studentID.local.email;

                Restangular.all('sharewithfriend').post(emailParams).then(function(user){
                    growl.success('Shared with '+$scope.coworker.email+" successfully.");
                    console.log("Shared with friend successfully");
                });
                $mixpanel.track('Shared with coworker');
                // $scope.coworker.role = 'client';
                // $scope.coworker.local = {};
                // $scope.coworker.local.email = $scope.coworker.email;
                // $scope.coworker.local.referral = true;
                // $scope.coworker.local.referredBy = $scope.studentcourse.studentID;
                // Restangular.all('student').post($scope.coworker)
                // .then(function(data){
                //     Restangular.one("studentcourses", $scope.studentcourseID).get().then(function(data1){
                //         $scope.duplicateStudentCourse = data1;
                //         $scope.duplicateStudentCourse._id = null;
                //         $scope.duplicateStudentCourse.studentID = data._id;
                //         $scope.duplicateStudentCourse.email = data.local.email;
                //         $scope.duplicateStudentCourse.referral = true;
                //         $scope.duplicateStudentCourse.referredBy = $scope.studentcourse.studentID;
                //         Restangular.all('studentcourses').post($scope.duplicateStudentCourse).then(function(data2){
                //             console.log("Duplocate course created :");
                //             var emailParams = {};
                //             emailParams.recepient = $scope.coworker.email;
                //             emailParams.mailtype = 'shareOnboarding';

                //             Restangular.all('sendemail').post(emailParams).then(function(user){
                //                 console.log("Send email");
                //             });
                //         });
                //     });
                //     console.log('Created student course :'+data._id);

                // });
            }

            $scope.bookmark = function(){
                var bookmarkTitle = $scope.studentcourse.product + " training portal";
                if ($window.sidebar && $window.sidebar.addPanel) { // Mozilla Firefox Bookmark
                        $window.sidebar.addPanel(bookmarkTitle,$window.location.href,'');
                } else if($window.external && ('AddFavorite' in $window.external)) { // IE Favorite
                    $window.external.AddFavorite(location.href,bookmarkTitle); 
                } else if($window.opera && $window.print) { // Opera Hotlist
                    this.title = bookmarkTitle;
                    return true;
                } else { // webkit - safari/chrome
                    alert('Press ' + ($window.navigator.userAgent.toLowerCase().indexOf('mac') != - 1 ? 'Command/Cmd' : 'CTRL') + ' + D to bookmark this page.');
                }
                $mixpanel.track('Bookmark Link Clicked');
                return true;
            }

        } ]);
