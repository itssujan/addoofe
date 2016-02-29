angular.module('app')
    .controller('CustomerDetailController', [
        '$scope', 'Restangular', 'Auth', '$stateParams',
        function ($scope, Restangular, Auth, $stateParams) {

            $scope.studentCourse            = {};
            $scope.firstName                = "";
            $scope.lastName                 = "";
            $scope.clientName               = "";
            $scope.email                    = "";
            $scope.customerAccountCreated   = "";
            $scope.product                  = "";
            $scope.status                   = "";
            $scope.score                    = $stateParams.score;


            Restangular.all("studentcourses?studentID=" + $stateParams.studentID + "&populate=studentID" + "&populate=courseID").getList().then(function (data) {
                $scope.studentCourse = data[0];
                var student = $scope.studentCourse.studentID,   // studentID now a populated object
                    course  = $scope.studentCourse.courseID;    // also now populated 

                $scope.firstName                = student.local.firstname;
                $scope.lastName                 = student.local.lastname;
                $scope.clientName               = student.local.clientName;
                $scope.email                    = student.local.email;
                $scope.customerAccountCreated   = student.createdOn;
                $scope.product                  = course.product;
            });
        }]);