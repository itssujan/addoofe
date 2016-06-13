angular.module('app')
    .controller('ReportsCtrl', [ '$scope', '$state','Restangular', '$rootScope','$cookieStore','growl',
        '$location', '$mixpanel','$filter','Auth',
        function ($scope, $state, Restangular,$rootScope,$cookieStore, growl, $location, $mixpanel,$filter,Auth) {
            console.log('In Reports controller');

             Restangular.all("reports?product="+Auth.user.product).getList().then(function (data) {
                $scope.report = data[0];
                drawTrackStatsChart();
                drawMonthlyStatsChart();
                drawVideoPositionsChart();
            });

              Restangular.all("topvideos").getList().then(function (data) {
                $scope.topvideos = data;
            });

            // Track stats 
            var drawTrackStatsChart = function() {
                $scope.labels = [];
                $scope.series = ['Total Tracks', 'Tracks Started', 'Tracks Completed', 'Tracks Partially Started'];
                $scope.data = [[],[], [],[]];
                console.log("AM here");
                angular.forEach($scope.report.trackStats,function(value,index){
                    console.log(JSON.stringify(value));
                    $scope.labels.push(value.title);
                    $scope.data[0].push(value.totalTracks);
                    $scope.data[1].push(value.tracksStarted);
                    $scope.data[2].push(value.tracksCompleted);
                    $scope.data[3].push(value.tracksPartiallyStarted);
                });                
            }
            // End track stats  

            var drawMonthlyStatsChart = function () {
                $scope.monthlyTracksLabels = [];
                $scope.monthlyTracksSeries = ['Month', 'Tracks Created'];
                $scope.monthlyTracksData = [[],[]];
                angular.forEach($scope.report.monthlyTracks,function(value,index){
                    console.log("Monthly tracks : "+value+" , "+index);
                    $scope.monthlyTracksLabels.push(monthName(value.month));
                    $scope.monthlyTracksData[0].push(value.count);
                });        
            }

            var drawVideoPositionsChart = function() {
                var videoPositionStats = $scope.report.videoPositionStats;
                $scope.videoPositionLabels = ["1", "2", "3", "4", "5", "6", "7", "8" , "9" , "10"];
                $scope.videoPositionSeries = [];
                $scope.videoPositionData = [];
                for(var i=0;i < videoPositionStats.length;i++) {
                    var videoPositionDataMultiArray = [];
                    var videoPositionStat =videoPositionStats[i];
                    var found = false;
                    $scope.videoPositionSeries.push(videoPositionStat.title);
                    for(var positionDataSeries = 1; positionDataSeries <= 10;positionDataSeries++){
                        for(var j=0;j < videoPositionStat.positionStats.length;j++) {
                            var positionStat = videoPositionStat.positionStats[j];
                            if(positionDataSeries == positionStat.position) {
                                videoPositionDataMultiArray.push(positionStat.count);
                                found = true;
                            }
                        }
                        if(!found) {
                            videoPositionDataMultiArray.push(0);
                        }
                    }
                    $scope.videoPositionData.push(videoPositionDataMultiArray);
                }
                console.log(videoPositionData);

            }

            var monthName = function (monthNumber) { //1 = January
                var monthNames = [ 'January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December' ];
                return monthNames[monthNumber];
            }



              
        } ]);