angular.module('app')
    .controller('DashboardCtrl', [ '$scope','envService', '$state','Restangular', '$rootScope',
        'Auth','Upload','growl','$mixpanel','$filter',
        function ($scope,envService, $state, Restangular,$rootScope, Auth, Upload, growl,$mixpanel,$filter) {
            console.log('In CustomerCareDashboardCtrl');

            $scope.newtraining = {};
            $scope.doc = {};

            $scope.auth = Auth;
            $scope.performUpload = false;

            console.log("Auth user :"+Auth.user.email);
            console.log("NODE SERVER URL "+envService.read('nodeserverurl'));

            if(Auth.user.manager){
                Restangular.all("course?product="+Auth.user.product+"&baseTrack=true&shareWithTeam=true&populate=author&author="+Auth.user.manager).getList().then(function(data){
                    Restangular.all("course?product="+Auth.user.product+"&baseTrack=true&populate=author&author="+Auth.user._id).getList().then(function(data1){
                        $scope.courses = data.concat(data1);
                        $scope.courses.forEach(function(element, index, array){
                            console.log(element.author);
                            element.fullname = element.author.local.firstname + " "+element.author.local.lastname;
                        });
                        $scope.displayedCourseCollection = [].concat($scope.courses);
                    });
                });
            } else {
                Restangular.all("course?product="+Auth.user.product+"&baseTrack=true&shareWithTeam=true&populate=author&author="+Auth.user._id).getList().then(function(data){
                    Restangular.all("course?product="+Auth.user.product+"&baseTrack=true&populate=author&author="+Auth.user._id).getList().then(function(data1){
                        $scope.courses = data.concat(data1);
                        $scope.courses.forEach(function(element, index, array){
                            console.log(element.author);
                            element.fullname = element.author.local.firstname + " "+element.author.local.lastname;
                        });
                        $scope.displayedCourseCollection = [].concat($scope.courses);
                    });
                });
            }

            var queryParams = "&populate=studentID&populate=courseID&populate=author";
            if(Auth.user.role == 'sales'){
                queryParams = "&author="+Auth.user._id+"&populate=studentID&populate=courseID";
            }

            Restangular.all("studentcourses?product="+Auth.user.product+queryParams+"&sort=-invitedOn").getList().then(function(data){
                $scope.studentcourses = data;
                $scope.studentcourses.forEach(function(element, index, array){
                        var totalLessonsCount = element.courseID && element.courseID.contents ? element.courseID.contents.length : 1;
                        var completedCount = 0;
                        if(element.lessonprogress.length > 0){
                            element.lessonprogress.forEach(function(element1, index1, array1){
                                if(element1.progress == 'complete'){
                                    completedCount = completedCount + 1;    
                                }
                            });
                            element.coursestatus = "Started";
                        } else if(element.progress == 'viewed') {
                            element.coursestatus = "Viewed";
                        } else {
                            element.coursestatus = "Invited";
                        }
                        element.title = element.courseID.title;
                        element.email = element.studentID.local.email;
                        if(Auth.user.role == 'sales'){
                            element.authorname = Auth.user.local.firstname +" "+Auth.user.local.lastname;
                        } else {
                            element.authorname = element.author.local.firstname +" "+element.author.local.lastname;
                        }
                        element.courseprogress = (completedCount * 100 )/totalLessonsCount;
                });
                $scope.displayedStudentCourseCollection = [].concat($scope.studentcourses);
            });

            $scope.addVideo = function(file) {
                var videourl = $scope.uploadVideo(file);
            };

            $scope.addDocument = function(file) {
                var videourl = $scope.uploadDocument(file);
            };

            $scope.uploadVideo = function (file) {
                Upload.upload({
                    url: ConstantService.nodeserverurl+'/upload',
                    data: {file: $scope.file, 'username': $scope.username}
                }).then(function (resp) {
                    console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data.uploadedPath);
                    growl.success('Video uploaded successfully!');
                    $mixpanel.track('Uploaded Video');
                    var videourl = resp.data.uploadedPath;
                    $scope.video.url = videourl;
                    $scope.video.product = Auth.user.product;
                    console.log("Saving video course :"+JSON.stringify($scope.video));
                    $scope.uploadPoster();
                }, function (resp) {
                    console.log('Error status: ' + resp.status);
                    growl.error('Error...please try again!');
                    $mixpanel.track('Error uploading video');
                }, function (evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                });
            };

            $scope.uploadDocument = function (file) {
                Upload.upload({
                    url: ConstantService.nodeserverurl+'/upload',
                    data: {file: $scope.documentfile, 'username': $scope.username}
                }).then(function (resp) {
                    console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data.uploadedPath);
                    growl.success('Document uploaded successfully!');
                    $mixpanel.track('Uploaded Document');
                    var documenturl = resp.data.uploadedPath;
                    $scope.doc.url = documenturl;
                    $scope.doc.product = Auth.user.product;
                    $scope.doc.type = 'document';
                    console.log("Saving video course :"+JSON.stringify($scope.doc));
                    Restangular.all('video').post($scope.doc)
                      .then(function(docu){
                        console.log('Video lesson created :'+docu.title);
                        growl.success('Document created successful!');
                      });
                }, function (resp) {
                    $mixpanel.track('Error uploading document');
                    console.log('Error status: ' + resp.status);
                    growl.error('Error...please try again!');
                }, function (evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                });
            };

            $scope.uploadPoster = function (file) {
                Upload.upload({
                    url: ConstantService.nodeserverurl+'/upload',
                    data: {file: $scope.posterfile, 'username': $scope.username}
                }).then(function (resp) {
                    console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data.uploadedPath);
                    growl.success('Video uploaded successfully!');
                    var posterurl = resp.data.uploadedPath;
                    $scope.video.posterurl = posterurl;
                    console.log("Saving video course :"+JSON.stringify($scope.video));
                    Restangular.all('video').post($scope.video)
                      .then(function(video){
                        console.log('Video lesson created :'+video.title);
                        growl.success('Lesson created successful!');
                      });
                }, function (resp) {
                    console.log('Error status: ' + resp.status);
                    growl.error('Error...please try again!');
                }, function (evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                });
            };

        } ]);
