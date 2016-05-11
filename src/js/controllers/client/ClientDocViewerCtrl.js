angular.module('app')
    .controller('ClientDocViewerCtrl', [ '$scope','envService', '$state','Restangular', '$rootScope',
        'Auth','growl','$mixpanel','$filter',
        function ($scope,envService, $state, Restangular,$rootScope, Auth, growl,$mixpanel,$filter) {
            console.log('In ClientDocViewerCtrl');

            $scope.pdfUrl = "https://addoo-dev.s3.amazonaws.com/content/videos/sharefile/1462805557689-BEIlVDgaXqUAYwN2.pdf";
  $scope.pdfName = 'Relativity: The Special and General Theory by Albert Einstein';


  $scope.scroll = 0;
  $scope.loading = 'loading';
            
  $scope.getNavStyle = function(scroll) {
    if(scroll > 100) return 'pdf-controls fixed';
    else return 'pdf-controls';
  }

  $scope.onError = function(error) {
    console.log(error);
  }

  $scope.onLoad = function() {
    $scope.loading = '';
  }

  $scope.onProgress = function(progress) {
    console.log(progress);
  }

        } ]);	
