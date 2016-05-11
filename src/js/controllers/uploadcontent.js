angular.module('app')
    .controller('UploadContentCtrl', [ '$scope', '$state','Restangular', '$rootScope','$cookieStore',
    	'growl','$location', '$mixpanel','$filter','envService','Auth',
        function ($scope, $state, Restangular,$rootScope,$cookieStore, growl, $location, $mixpanel,$filter,envService,Auth) {
            console.log('In UploadContentCtrl');

            $scope.user = {};
            $scope.$state = $state;
            $scope.s3OptionsUri = envService.read("nodeserverurl")+"/s3options";
            $scope.product = Auth.user.product;
            $scope.bucket = envService.read("aws_bucket");
            console.log("Bucket :"+$scope.bucket)

		    $scope.video = {};
            $scope.video.type = 'video';

		    $scope.performUpload = false;

            $scope.saveVideo = function(){
                console.log(" Video details : "+JSON.stringify($scope.video));
                $scope.video.product = $scope.product;
                Restangular.all('video').post($scope.video)
                  .then(function(video){
                    console.log('Video lesson created :'+video.title);
                    growl.success('Video details posted successfully..');
                  });
            }
        } ]);
