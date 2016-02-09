angular.module('app')
    .controller('DashboardStatsCtrl', [ '$scope','envService', '$state','Restangular', '$rootScope',
        'Auth','growl','$mixpanel','$filter',
        function ($scope,envService, $state, Restangular,$rootScope, Auth, growl,$mixpanel,$filter) {
            console.log('In DashboardTracksCtrl');

             var today = new Date();
             var date = new Date();
             $scope.labels = [];
             $scope.data = [];
             $scope.loading = true;

             Restangular.all("weeklytrackstats").getList().then(function (data) {
                var data1 = [];
                for(var i=0; i < 7; i++) {
                    $scope.labels.push(data[i].date.dateStr);
                    data1.push(data[i].count);
                }
                $scope.data.push(data1);
                $scope.loading = false;
             });

            $scope.series = ['Tracks by your team'];


            // $scope.data = [
            // [65, 59, 80, 81, 56, 55, 40]
            // ];

            $scope.onClick = function (points, evt) {
                console.log(points, evt);
            };



        } ]);
