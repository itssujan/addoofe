angular.module('app')
    .controller('DashboardCtrl', ['$scope', 'envService', '$state', 'Restangular', '$rootScope',
        'Auth', 'growl', '$mixpanel', '$filter',
        function ($scope, envService, $state, Restangular, $rootScope, Auth, growl, $mixpanel, $filter) {
        	console.log('In DashboardCtrl');

        	$scope.newtraining = {};
        	$scope.doc = {};
        	$scope.auth = Auth;
        	$scope.performUpload = false;
            $scope.loading = true;

        	console.log("Auth user :" + Auth.user.manager);

        	if (Auth.user.manager) {
        		Restangular.all("course?product=" + Auth.user.product + "&baseTrack=true&shareWithTeam=true&populate=author&author=" + Auth.user.manager).getList().then(function (data) {
        			Restangular.all("course?product=" + Auth.user.product + "&baseTrack=true&populate=author&author=" + Auth.user._id).getList().then(function (data1) {
        				$scope.courses = data.concat(data1);
        				$scope.courses.forEach(function (element, index, array) {
        					element.fullname = element.author.local.firstname + " " + element.author.local.lastname;
        				});
        				$scope.displayedCourseCollection = [].concat($scope.courses);
                        $scope.loading = false;
        			});
        		});
        	} else {
        		Restangular.all("course?product=" + Auth.user.product + "&baseTrack=true&populate=author&author=" + Auth.user._id).getList().then(function (data) {
        				$scope.courses = data;
        				$scope.courses.forEach(function (element, index, array) {
        					element.fullname = element.author.local.firstname + " " + element.author.local.lastname;
        				});
        				$scope.displayedCourseCollection = [].concat($scope.courses);
                        $scope.loading = false;
        		});
        	}

        	var queryParams = "&populate=studentID&populate=courseID&populate=author";
        	if (Auth.user.permissions.indexOf('canSeeAllTracks') < 0) {
        		queryParams = "&author=" + Auth.user._id + "&populate=studentID&populate=courseID";
        	}

        	$scope.showToolTip = function (event) {
        		event.target.tooltip();
        	};

        	$scope.uploadVideo = function (file) {
        		Upload.upload({
        			url: ConstantService.nodeserverurl + '/upload',
        			data: { file: $scope.file, 'username': $scope.username }
        		}).then(function (resp) {
        			console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data.uploadedPath);
        			growl.success('Video uploaded, successfully!');
        			$mixpanel.track('Uploaded Video');
        			var videourl = resp.data.uploadedPath;
        			$scope.video.url = videourl;
        			$scope.video.product = Auth.user.product;
        			console.log("Saving video course :" + JSON.stringify($scope.video));
        			$scope.uploadPoster();
        		}, function (resp) {
        			console.log('Error status: ' + resp.status);
        			growl.error('Error...please try again!');
        			$mixpanel.track('Error uploading video');
        		}, function (evt) {
        			var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
        			console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
        		});
        	};
        }]);
