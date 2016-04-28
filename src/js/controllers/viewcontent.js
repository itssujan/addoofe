angular.module('app')
    .controller('ViewContentCtrl', [ '$scope', '$state','Restangular', '$rootScope','$cookieStore','growl',
        '$location', '$mixpanel','$filter','Auth',
        function ($scope, $state, Restangular,$rootScope,$cookieStore, growl, $location, $mixpanel,$filter,Auth) {
            console.log('In ViewContent controller');
            
            // Get Content..
            Restangular.all("video?product="+Auth.user.product+"&sort=title").getList().then(function (data) {
                console.log(data);
                $scope.videos = data;
                $scope.displayedVideos = [].concat($scope.videos);
            });

        } ]);