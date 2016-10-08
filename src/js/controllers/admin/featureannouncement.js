angular.module('app')
    .controller('FeatureAnnouncementCtrl', ['$scope', 'envService', '$state', 'Restangular', '$rootScope',
        'Auth', 'growl', '$mixpanel', '$filter','$uibModal',
        function ($scope, envService, $state, Restangular, $rootScope, Auth, growl, $mixpanel, $filter, $uibModal) {
        	console.log('In FeatureAnnouncementCtrl');
            $scope.maxContentCount = 4;
            $scope.multiVideoSelect = false;

        	$scope.onboarding = {};
        	$scope.onboarding.feature = {};
        	$scope.onboarding.feature.content = [];
            $scope.onboarding.feature.htmlContent = "<h1>Hello World</h1>"
            $scope.froalaOptions = {
                toolbarButtons: ['fullscreen', 'bold', 'italic', 'underline', 'strikeThrough', 'fontFamily',
                 'fontSize', 'color', 'emoticons', '-',  'paragraphFormat', 'paragraphStyle', 'align', 'formatOL', 
                 'formatUL', 'outdent', 'indent', '-', 'insertLink', 'insertImage', 'insertVideo', 
                 'insertTable', 'insertFile', 'undo', 'redo', 'html'],
            toolbarButtonsMD: null,
            toolbarButtonsSM: null,
            toolbarButtonsXS: null,

                // toolbarButtons: ['bold', 'italic', 'underline', 'strikeThrough', 'fontFamily', 'fontSize', 'color', 'emoticons', '-',  'paragraphFormat', 'paragraphStyle', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', '-', 'insertLink', 'insertImage', 'insertVideo', 'insertTable', 'insertFile', 'undo', 'redo', 'html'],
                // toolbarButtonsXS: ['undo', 'redo' , '-', 'bold', 'italic', 'underline']
            }



            var initializeContent = function() {
                for(var i=0; i < $scope.maxContentCount ; i++) {
                    var content = {};
                    $scope.onboarding.feature.content.push(content);                    
                }
            }

            var getVideos = function() {
                Restangular.all("video?type=video&product=" + Auth.user.product).getList().then(function (data) {
                    if (!$scope.videolessons) {
                        $scope.videolessons = [];
                    }

                    $scope.videolessons = $scope.videolessons.concat(data);
                    $scope.displayedvideolessons = [].concat($scope.videolessons);
                });
            }

            var getProduct = function() {
                Restangular.one('product?name='+Auth.user.product).get().then(function (product) {
                    $scope.product = product[0];
                });
            }   


            initializeContent();
            getVideos();
            getProduct();


            

            $scope.getMaxContentCount = function(num) {
                return new Array(num);   
            }

        	$scope.save = function() {
                    console.log("Saving :"+JSON.stringify($scope.onboarding.feature.htmlContent));
                    $scope.onboarding.onboardingType = "feature";
                    $scope.onboarding.product = $scope.product._id;
                    console.log("Saving :"+JSON.stringify($scope.onboarding));
                    Restangular.all('onboardingsetup').post($scope.onboarding).then(function(data){
                        growl.success('Product saved..');
                    });
            }

            $scope.openSegmentModal = function () {
                $scope.segmentModalInstance = $uibModal.open({
                  animation     : true,
                  templateUrl   : 'templates/modals/CreateSegment.html',
                  controller    : 'CreateSegmentModalController',
                  scope         : $scope,
                  resolve: {
                        content: function () {
                            return {};
                        }
                    }
                });
            };

            $scope.openVideoListModal = function () {
                $scope.videoModalInstance = $uibModal.open({
                  animation     : true,
                  templateUrl   : 'templates/modals/VideoListModal.html',
                  scope         : $scope
                });
            };

            $scope.closeVideoListModal = function () {
                $scope.videoModalInstance.dismiss('cancel');
            };

            $scope.openVideoPreviewModal = function (video) {
                if (!video.url) {
                    Restangular.one("video", video.videoID).get().then(function (data) {
                        $scope.openTheModal(data);
                    });
                } else {
                    $scope.openTheModal(video);
                }
            }

            $scope.openTheModal = function (video) {
                $scope.videoPreviewModalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'templates/modals/VideoPreviewModal.html',
                    controller: 'VideoPreviewModalController',
                    scope: $scope,
                    resolve: {
                        content: function () {
                            return { video: video };
                        }
                    }
                });
            }

            $scope.addVideoToTrack = function(video){
                angular.forEach($scope.videolessons, function(value, key) {
                  if(value.selected == true) {
                    var content =  {videoID : value._id, videoTitle : value.title};
                    $scope.onboarding.feature.content.splice($scope.selectedFieldIndex, 1,content);
                  }
                });    
                $scope.closeVideoListModal();            
            }

            $scope.markField = function(index) {
                $scope.selectedFieldIndex = index;
            }

        }]);
