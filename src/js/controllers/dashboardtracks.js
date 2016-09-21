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
            if(Auth.user.permissions.indexOf('canSeeAllTracks') < 0){
                queryParams = "&author="+Auth.user._id+"&populate=studentID&populate=courseID";
            }

            var getActiveTracks = function() {
                Restangular.all("studentcourses?product="+Auth.user.product+queryParams+"&sort=-invitedOn&limit=70").getList().then(function(data){
                    populateTable(data);
                });
            }

            //&limit=100
            getActiveTracks();

            $scope.search = function(text) {
                $scope.loading = true;
                if(text == "") {
                    getActiveTracks();
                } else {
                    Restangular.all("studentcoursesearch?text="+text).getList().then(function(data){
                        populateTable(data);
                    });
                }
            }

            var populateTable = function(data) {
                $scope.studentcourses = data;
                $scope.studentcourses.forEach(function(element, index, array){

                    if(element.studentID.local.firstname && element.studentID.local.lastname) {
                        element.name = element.studentID.local.firstname+" "+element.studentID.local.lastname;
                    } else if(element.studentID.local.firstname) {
                        element.name = element.studentID.local.firstname;
                    } else if(element.studentID.local.lastname) {
                        element.name = element.studentID.local.lastname;
                    }
                    if (element.name) {
                        element.name = element.name.toLowerCase();
                    }
                    if(Auth.user.role == 'sales'){
                        element.authorname = Auth.user.local.firstname +" "+Auth.user.local.lastname;
                    } else {
                        element.authorname = element.authorFirstName +" "+element.authorLastName;
                    }
                });
                $scope.displayedStudentCourseCollection = [].concat($scope.studentcourses);
                $scope.loading = false;
            }
        } ]);
