angular.module('app')
    .controller('ClientDashboardController', [ '$scope', '$state','Restangular', '$rootScope','$stateParams',
        '$timeout','pdfDelegate','$mixpanel','$window',
        function ($scope, $state, Restangular,$rootScope, $stateParams, $timeout, pdfDelegate,$mixpanel,$window) {
            console.log('In ClientDashboardController');

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

            Restangular.one("studentcourses/"+$scope.studentcourseID+"?populate=courseID&populate=studentID&populate=onboardingSpecialist").get().then(function(data){
                $scope.studentcourse = data;
                $scope.sendEvent("Customer viewed onboarding track");
                if($scope.studentcourse.visitCount){
                    $scope.studentcourse.visitCount = $scope.studentcourse.visitCount + 1;
                } else {
                    $scope.studentcourse.visitCount = 1;
                }
                if(!$scope.studentcourse.progress || $scope.studentcourse.progress == 'invited'){
                    $scope.studentcourse.progress = "viewed";
                    $scope.studentcourse.put();
                }
                console.log("Playing the video....");
                $scope.playVideo($scope.currentVideoIndex);
                getUpcomingVideos();
            });

            var getUpcomingVideos = function() {
                $scope.studentcourse.courseID.contents.forEach(function(element, index, array) {
                    Restangular.one("video", element.videoID).get().then(function(data){
                            element.videourl = data.url;
                            element.posterurl = data.posterurl;   
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
                if (pushupdate) {
                    $scope.studentcourse.put();
                }
            };

            $scope.sendEvent = function(event){
                $mixpanel.track(event, {
                    "Email": $scope.studentcourse.email
                });
            }

            $scope.addCoworker = function(){
                console.log("Adding coworker");
                $scope.coworker.role = 'client';
                $scope.coworker.local = {};
                $scope.coworker.local.email = $scope.coworker.email;
                $scope.coworker.local.referral = true;
                $scope.coworker.local.referredBy = $scope.studentcourse.studentID;
                Restangular.all('student').post($scope.coworker)
                .then(function(data){
                    Restangular.one("studentcourses", $scope.studentcourseID).get().then(function(data1){
                        $scope.duplicateStudentCourse = data1;
                        $scope.duplicateStudentCourse._id = null;
                        $scope.duplicateStudentCourse.studentID = data._id;
                        $scope.duplicateStudentCourse.email = data.local.email;
                        $scope.duplicateStudentCourse.referral = true;
                        $scope.duplicateStudentCourse.referredBy = $scope.studentcourse.studentID;
                        Restangular.all('studentcourses').post($scope.duplicateStudentCourse).then(function(data2){
                            console.log("Duplocate course created :");
                            var emailParams = {};
                            emailParams.recepient = $scope.coworker.email;
                            emailParams.mailtype = 'shareOnboarding';

                            Restangular.all('sendemail').post(emailParams).then(function(user){
                                console.log("Send email");
                            });
                        });
                    });
                    console.log('Created student course :'+data._id);
                    $mixpanel.track('Shared with coworker');
                });
            }

            $scope.bookmark = function(){
                if ($window.sidebar && $window.sidebar.addPanel) { // Mozilla Firefox Bookmark
                        $window.sidebar.addPanel("Test bookmark",$window.location.href,'');
                } else if($window.external && ('AddFavorite' in $window.external)) { // IE Favorite
                    $window.external.AddFavorite(location.href,"Test bookmark"); 
                } else if($window.opera && $window.print) { // Opera Hotlist
                    this.title="Test bookmark";
                    return true;
                } else { // webkit - safari/chrome
                    alert('Press ' + ($window.navigator.userAgent.toLowerCase().indexOf('mac') != - 1 ? 'Command/Cmd' : 'CTRL') + ' + D to bookmark this page.');
                }
                $mixpanel.track('Bookmark Link Clicked');

            }

        } ]);
