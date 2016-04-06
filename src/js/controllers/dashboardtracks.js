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

            //&limit=100
            Restangular.all("studentcourses?product="+Auth.user.product+queryParams+"&sort=-invitedOn&limit=20").getList().then(function(data){
                populateTable(data);
            });

            $scope.search = function(text) {
                $scope.loading = true;
                Restangular.all("studentcoursesearch?text="+text).getList().then(function(data){
                    console.log(data);
                    populateTable(data);
                });
            }

            var populateTable = function(data) {
                console.log(data);
                $scope.studentcourses = data;
                $scope.studentcourses.forEach(function(element, index, array){

                    element.name = element.studentID.local.firstname+" "+element.studentID.local.lastname;
                    if(Auth.user.role == 'sales'){
                        element.authorname = Auth.user.local.firstname +" "+Auth.user.local.lastname;
                    } else {
                        element.authorname = element.authorFirstName +" "+element.authorFirstName;
                    }
                });
                $scope.displayedStudentCourseCollection = [].concat($scope.studentcourses);
                $scope.loading = false;

            }



        } ]);
