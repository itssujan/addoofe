angular.module('app')
    .controller('DashboardTracksCtrl', [ '$scope','envService', '$state','Restangular', '$rootScope',
        'Auth','growl','$mixpanel','$filter',
        function ($scope,envService, $state, Restangular,$rootScope, Auth, growl,$mixpanel,$filter) {
            console.log('In DashboardTracksCtrl');

            $scope.newtraining = {};
            $scope.doc = {};

            $scope.auth = Auth;
            $scope.performUpload = false;
            $scope.loading = true;
            $scope.searchText = '';

            var queryParams = "&populate=studentID&populate=courseID&populate=author";
            if(Auth.user.role == 'sales'){
                queryParams = "&author="+Auth.user._id+"&populate=studentID&populate=courseID";
            }

            Restangular.all("studentcourses?product="+Auth.user.product+queryParams+"&sort=-invitedOn&limit=100").getList().then(function(data){
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
                        if(element.studentID.local.firstname || element.studentID.local.lastname) {
                            element.name = element.studentID.local.firstname+" "+element.studentID.local.lastname;
                        } else {
                            element.name = "";
                        }
                        if(Auth.user.role == 'sales'){
                            element.authorname = Auth.user.local.firstname +" "+Auth.user.local.lastname;
                        } else {
                            element.authorname = element.author.local.firstname +" "+element.author.local.lastname;
                        }
                        element.courseprogress = (completedCount * 100 )/totalLessonsCount;
                });
                $scope.displayedStudentCourseCollection = [].concat($scope.studentcourses);
                $scope.loading = false;

            });

            $scope.search = function(text) {
                Restangular.all("studentcoursesearch?text="+text).getList().then(function(data){
                    console.log(data);
                });
            }



        } ]);
