angular.module('app')
	.controller('VideoPreviewModalController', ['$scope', '$uibModalInstance', '$timeout', 'content', function ($scope, $uibModalInstance, $timeout, content) {

		$scope.video	= content.video;
		$scope.API		= null;

		$scope.config = {
			sources: [],
			tracks	: [{
				src		: "http://www.videogular.com/assets/subs/pale-blue-dot.vtt",
				kind	: "subtitles",
				srclang	: "en",
				label	: "English",
				default	: ""
			}],
			theme	: {
				url		: "http://www.videogular.com/styles/themes/default/latest/videogular.css"
			},
			plugins	: {
				poster	: null,
				url		: ""
			}
		};

		$scope.onPlayerReady = function (API) {
			$scope.API = API;
			console.log($scope.video.url);
			$scope.setVideo({ src: $scope.video.url, type: "video/mp4" });
		};

		$scope.setVideo = function (videoSource) {
			$scope.config.sources.push(videoSource);
			$timeout($scope.API.play.bind($scope.API), 100);
		};
	}]);