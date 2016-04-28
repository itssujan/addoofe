angular.module('app')
    .controller('EditContentCtrl', [ '$scope', '$state','Restangular', '$rootScope','$cookieStore','growl',
        '$location', '$mixpanel','$filter','Auth','$stateParams',
        function ($scope, $state, Restangular,$rootScope,$cookieStore, growl, $location, $mixpanel,$filter,Auth,$stateParams) {
            console.log('In EditContent controller');

            $scope.videoID  = $stateParams.videoID;
                       
            Restangular.one("video",$scope.videoID).get().then(function (data) {
                $scope.video = data;
            });

            $scope.update = function() {
                $scope.video.put();
                growl.success('Video content updated..');
            }

        } ]);