angular.module('app')
    .controller('DashboardStatsCtrl', [ '$scope','envService', '$state','Restangular', '$rootScope',
        'Auth','growl','$mixpanel','$filter',
        function ($scope,envService, $state, Restangular,$rootScope, Auth, growl,$mixpanel,$filter) {
            console.log('In DashboardTracksCtrl');

             var today = new Date();
             var date = new Date();

            $scope.labels = [today.toDateString(), today-1, today-2, today-3, today-4, today-5, today-6];
            $scope.series = ['Series A', 'Series B'];


            $scope.data = [
            [65, 59, 80, 81, 56, 55, 40],
            [28, 48, 40, 19, 86, 27, 90]
            ];

            $scope.onClick = function (points, evt) {
            console.log(points, evt);
            };



        } ]);
