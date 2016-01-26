angular.module('app')
    .controller('TrackBuilderModalCtrl', [ '$scope','Restangular', '$uibModal','Auth','$stateParams',
        function ($scope, Restangular,$uibModal,Auth,$stateParams) {
            console.log('In CCTrackBuilderCtrl');

            $scope.open = function (size) {

            var modalInstance = $uibModal.open({
              animation: $scope.animationsEnabled,
              templateUrl: 'myModalContent.html',
              controller: 'ModalInstanceCtrl',
              size: size,
              resolve: {
                items: function () {
                  return $scope.items;
                }
              }
            });

            modalInstance.result.then(function (selectedItem) {
              $scope.selected = selectedItem;
            }, function () {
              $log.info('Modal dismissed at: ' + new Date());
            });
            };

              $scope.toggleAnimation = function () {
                $scope.animationsEnabled = !$scope.animationsEnabled;
              };

            $scope.course = {};
            $scope.video = {};
            $scope.courseID = "";
            $scope.showtrackbuilder = false;

            $scope.auth = Auth;
            $scope.courseID = $stateParams.courseID;
            $scope.student = {};
            $scope.selectedVideos = [];

            var self = this;

            var videoQuery = "video?product="+Auth.user.product
            if(Auth.user.product == 'sharefile' || Auth.user.product == 'rightsignature' ){
                videoQuery = "video"
            }
            Restangular.all(videoQuery).getList().then(function(data){
                $scope.videolessons = data;
            });
        } ]);
