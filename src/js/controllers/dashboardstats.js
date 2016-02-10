angular.module('app')
    .controller('DashboardStatsCtrl', [ '$scope','envService', '$state','Restangular', '$rootScope',
        'Auth','growl','$mixpanel','$filter',
        function ($scope,envService, $state, Restangular,$rootScope, Auth, growl,$mixpanel,$filter) {
            console.log('In DashboardTracksCtrl');

             // var today = new Date();
             // var date = new Date();
             $scope.labels = [];
             $scope.data = [];
             $scope.loading = true;
             $scope.auth = Auth;

             Restangular.all("weeklytrackstats").getList().then(function (data) {
                var data1 = [];
                for(var i=0; i < 7 && data[i]; i++) {
                    $scope.labels.push(data[i].date.month+"/"+data[i].date.day+"/"+data[i].date.year);
                    data1.push(data[i].count);
                }
                $scope.labels.reverse();
                data1 = data1.reverse();
                $scope.data.push(data1);
                if(data && data.length > 0) {
                    $scope.loading = false;
                }
             });
            // $scope.data = [
            // [65, 59, 80, 81, 56, 55, 40]
            // ];

            $scope.series = ['Tracks by your team'];

            $scope.onClick = function (points, evt) {
                console.log(points, evt);
            };

            // Get Leader board..
            Restangular.all("topweeklyusers").getList().then(function (data) {
                $scope.topfiveusers = data;
                Restangular.all("myweeklyscore").getList().then(function (data1) {
                    if(data1 && data1[0]){
                        data1[0].username = "You";
                        $scope.topfiveusers.push(data1[0]);
                    } else {
                        // Hack to temporarily show user tracks as zero
                        var tmpData = {};
                        tmpData.username = "You";
                        tmpData.author = Auth.user._id;
                        tmpData.count = 0;
                        $scope.topfiveusers.push(tmpData);
                    }
                });
            });

        } ]);
