angular.module('app')
    .controller('ViewContentCtrl', [ '$scope', '$state','Restangular', '$rootScope','$cookieStore','growl',
        '$location', '$mixpanel','$filter','Auth',
        function ($scope, $state, Restangular,$rootScope,$cookieStore, growl, $location, $mixpanel,$filter,Auth) {
            console.log('In ViewContent controller');
            
            // Get Content..
            Restangular.all("video?type=video&product="+Auth.user.product+"&sort=title").getList().then(function (data) {
                console.log("Videos count :"+data.length);
                $scope.videos = data;
                $scope.displayedVideos = [].concat($scope.videos);
            });

            Restangular.all("video?type=document&product="+Auth.user.product+"&sort=title").getList().then(function (data) {
                console.log("Documents count :"+data.length);
                $scope.documents = data;
                $scope.displayedDocuments = [].concat($scope.documents);
            });

        } ]);