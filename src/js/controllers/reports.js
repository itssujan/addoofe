angular.module('app')
    .controller('ReportsCtrl', [ '$scope', '$state','Restangular', '$rootScope','$cookieStore','growl',
        '$location', '$mixpanel','$filter','Auth',
        function ($scope, $state, Restangular,$rootScope,$cookieStore, growl, $location, $mixpanel,$filter,Auth) {
            console.log('In Reports controller');

             Restangular.all("reports?product="+Auth.user.product).getList().then(function (data) {
                $scope.report = data[0];
                drawTrackStatsChart();
            });

              Restangular.all("topvideos").getList().then(function (data) {
                $scope.topvideos = data;
            });

            // Track stats 
            var drawTrackStatsChart = function() {
                $scope.labels = [];
                $scope.series = ['Total Tracks', 'Tracks Started', 'Tracks Completed'];
                $scope.data = [[],[], []];
                console.log("AM here");
                angular.forEach($scope.report.trackStats,function(value,index){
                    console.log(JSON.stringify(value));
                    $scope.labels.push(value.title);
                    $scope.data[0].push(value.totalTracks);
                    $scope.data[1].push(value.tracksStarted);
                    $scope.data[2].push(value.tracksCompleted);
                });                
            }


            // End track stats  

              
        } ]);