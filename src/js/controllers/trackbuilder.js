angular.module('app')
    .controller('TrackBuilderCtrl', [ '$scope', '$state','Restangular', '$rootScope','Auth', 'growl', 
        '$stateParams','$location','$mixpanel','$filter',
        function ($scope, $state, Restangular,$rootScope, Auth, growl, $stateParams, $location, 
            $mixpanel,$filter) {
            console.log('In CCTrackBuilderCtrl');

            $scope.course = {};
            $scope.video = {};
            $scope.courseID = "";
            $scope.showtrackbuilder = false;

            $scope.auth = Auth;
            $scope.courseID = $stateParams.courseID;
            $scope.student = {};
            $scope.selectedVideos = [];

            $scope.customerSupportReps = Restangular.all("user?role=customer-onboarding-specialist").getList().$object;

            $scope.tableCallbacks = {

                // drag and drop event of the table...
                dropped :  function(event){
                    console.log("Updating course list..");
                    $scope.course.put();
                }
            };

            $scope.deleteTrack = function(index) {
                console.log(index);
                $scope.course.contents.splice(index, 1);
                $scope.course.put().then(function(){
                    $mixpanel.identify(Auth.user._id);
                    $mixpanel.track('Deleted Track Content');
                    growl.success('Tracked deleted..');
                    console.log("Deleted....");
                });
            }

            $scope.updateClientList = function() {
                 Restangular.all("studentcourses?courseID="+$scope.courseID+"&populate=studentID").getList().then(function(data){
                    $scope.studentcourses = data;

                    $scope.studentcourses.forEach(function(element, index, array){
                        element.inviteurl = "http://"+$location.host()+"/index.html#/client/dashboard/"+element._id;
                    });

                });

            }

            console.log("Course ID ::: "+$scope.courseID);
            if($scope.courseID){
                Restangular.one("course",$scope.courseID).get().then(function(data){
                    $scope.course = data;
                    if(!$scope.course.baseTrack){
                        $scope.course.baseTrack = false;
                    }
                    if(!$scope.course.shareWithTeam){
                        $scope.course.shareWithTeam = false;
                    }
                });
                $scope.updateClientList();
                $scope.showtrackbuilder = true;
            }

            var self = this;

            var videoQuery = "video?product="+Auth.user.product
            if(Auth.user.product == 'sharefile' || Auth.user.product == 'rightsignature' ){
                videoQuery = "video"
            }
            Restangular.all(videoQuery).getList().then(function(data){
                $scope.videolessons = data;
            });

            console.log("Auth user :"+Auth.user.email);

            $scope.addTrack = function() {
                $scope.course.product = Auth.user.product;
                console.log("Adding track");
                Restangular.all('course').post($scope.course).then(function(data){
                    console.log('Course created :'+data._id);
                    $scope.course = data;
                    $scope.courseID = data._id;
                    $scope.course._id = data._id;
                    $scope.showtrackbuilder = true;
                    $mixpanel.track('Added track');

                });
            }

            $scope.saveContent = function(type){
                if(type == 'video'){
                    $scope.saveVideo($scope.courseID);
                }
            }

            $scope.saveVideo = function(courseID){
                console.log("Saving video course :"+courseID);
                $scope.video.courseID = courseID;
                Restangular.all('video').post($scope.video)
                  .then(function(video){
                    console.log('Video lesson created :'+video.title);
                    $scope.course  = Restangular.one("course",$scope.courseID).get().$object;
                    growl.success('Lesson created successful!');
                  });
            }

            $scope.showMessage = function() {
                console.log("clip-click works!");
                $mixpanel.track('Client Copy URL Clicked');
                growl.success('Onboarding link copied to the clipboard. Please paste it in your thank you email to the customer!');
            };


            $scope.inviteClient = function(){
                $scope.student.role = 'client';
                Restangular.all('student').post($scope.student)
                .then(function(data){
                    createStudentCourse(data);
                    console.log('Created student course :'+data._id);
                    $mixpanel.track('Invite Client');
                });
            }

            var createStudentCourse = function(student) {
              $scope.student.courseID = $scope.courseID;
              $scope.student.studentID = student._id;
              $scope.student.email = student.local.email;
              $scope.student.product = Auth.user.product;
              $scope.student.progress = "invited";
              $scope.student.onboardingSpecialist = $scope.onboardingSpecialist;
              console.log('Trying to invite students :'+JSON.stringify($scope.student));

              Restangular.all('studentcourses').post($scope.student)
                .then(function(data){
                  $scope.updateClientList();  
                  console.log('Created student course :'+data._id);
                  growl.success('Onboarding track created. Please copy the link by clicking the "Copy Invite Link" in the clients tab!');
                });

            };

            $scope.addVideoToQueue = function(checked,video){
                var videoID = video._id
                console.log("Video ID :"+videoID);
                if(!checked) {
                    var index = $scope.selectedVideos.indexOf(videoID);
                    $scope.selectedVideos.splice(index, 1);     
                }
                else if( $scope.selectedVideos.indexOf(videoID) < 0 ){
                    $scope.selectedVideos.push(videoID);
                }
                    

                console.log("Got event :"+$scope.selectedVideos);
            };

            $scope.addVideoToTrack = function(filetype){
                console.log("Adding these tracks :"+$scope.selectedVideos);
                $scope.selectedVideos.forEach(function(element, index, array){
                    $scope.videolessons.forEach(function(videoelement, videoindex, videoarray){
                        if(videoelement._id == element){
                            var video1 = videoelement;
                            var content = {
                            type : filetype,
                            title : video1.title,
                            videoID : video1._id
                        };
                            if(!$scope.course.contents)
                                $scope.course.contents = [];

                            $scope.course.contents.push(content);    

                            console.log("Video : "+JSON.stringify(video1));                       
                        }
                    });
                });
                $scope.course.put();
                $scope.selectedVideos = [];
            };

            $scope.baseTrack = function(test){
                $scope.course.put();
            }

        } ]);
