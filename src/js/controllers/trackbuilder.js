angular.module('app')
    .controller('TrackBuilderCtrl', ['$scope', '$state', 'Restangular', '$rootScope', 'Auth', 'growl',
        '$stateParams', '$location', '$mixpanel', '$filter', 'ngDialog', 'deviceDetector', '$uibModal', 'CustomModalService',
        function ($scope, $state, Restangular, $rootScope, Auth, growl, $stateParams, $location,
            $mixpanel, $filter, ngDialog, deviceDetector, $uibModal, CustomModalService) {

        	console.log('In CCTrackBuilderCtrl');
        	console.log("Browser : " + deviceDetector.browser);

        	$scope.loading			= true;
        	$scope.course			= {};
        	$scope.video			= {};
        	$scope.courseID			= $stateParams.courseID;
        	$scope.showtrackbuilder = false;
        	$scope.auth				= Auth;
        	$scope.user				= Auth.user;
        	$scope.studentCourseID  = $stateParams.studentCourseID;
        	$scope.student			= {};
        	$scope.selectedVideos	= [];
            $scope.showprogress     = true;

        	$scope.customerSupportReps = Restangular.all("user?role=customer-onboarding-specialist").getList().$object;

        	$scope.tableCallbacks = {
        		dropped : function (event) { // drag and drop event of the table...
        			console.log("Updating course list..");
        			$scope.course.put();
        		}
        	};

        	$scope.deleteTrack = function (index) {
        		console.log(index);
        		$scope.course.contents.splice(index, 1);
        		$scope.course.put().then(function () {
        			$mixpanel.identify(Auth.user._id);
        			$mixpanel.track('Deleted Track Content');
        			growl.success('Tracked deleted..');
        		});
        	}

        	$scope.updateClientList = function () {
        		// Restangular.all("studentcourses?courseID=" + $scope.courseID + "&populate=studentID").getList().then(function (data) {
        		// 	$scope.studentcourses = data;
        		// 	$scope.displayedStudentCourseCollection = [].concat($scope.studentcourses);

        		// 	$scope.studentcourses.forEach(function (element, index, array) {
        		// 		element.inviteurl = "http://" + $location.host() + "/index.html#/client/dashboard/" + element._id;
        		// 	});
        		// });
                if($scope.studentcourse) {
                    $scope.studentcourse.inviteurl = "https://" + $location.host() + "/index.html#/client/dashboard/v2/" + $scope.studentcourse._id;
                    console.log("******* trying to get invite url :"+$scope.studentcourse.inviteurl);
                }
        	}

        	var getApplicableContentForProducts = function (prod) {
        		var applicableContent = [];
        		if (prod == 'sharefile' || prod == 'rightsignature') {
        			applicableContent.push('sharefile');
        			applicableContent.push('shareconnect');
        			applicableContent.push('rightsignature');
        		} else if (prod == 'shareconnect') {
        			applicableContent.push('shareconnect');
        		} else if (prod == 'podio') {
        			applicableContent.push('podio');
        		} else if (prod == 'addoo') {
        			applicableContent.push('addoo');
        		} else if (prod == 'demo') {
                    applicableContent.push('demo');
                } else if (prod == 'bollo') {
                    applicableContent.push('bollo');
                }

        	}

        	if ($scope.studentCourseID) {
                console.log("Got student course");
        		Restangular.all("studentcourses?_id="+$scope.studentCourseID+"&populate=courseID").getList().then(function (data) {
                    $scope.studentcourse = data[0];

        			if ($stateParams.message) {
        				growl.success($stateParams.message);
        			}
                    
        			$scope.course = $scope.studentcourse.courseID;
                    Restangular.one("course",$scope.course._id).get().then(function (data) {
                        $scope.course = data;
                        updateViewStatus();    
                    })
                    $scope.courseID = $scope.course._id;
                    

        			if (!$scope.course.baseTrack) {
        				$scope.course.baseTrack = false;
        			}
        			if (!$scope.course.shareWithTeam) {
        				$scope.course.shareWithTeam = false;
        			}
                    $scope.updateClientList();
        		});

        		
        		$scope.showtrackbuilder = true;
                $scope.loading = false;
        	} else if($scope.courseID) {
                console.log("Got course");
                Restangular.one("course",$scope.courseID).get().then(function (data) {
                    $scope.course = data;
                    console.log("Course : "+JSON.stringify($scope.course));
                    if ($stateParams.message) {
                        growl.success($stateParams.message);
                    }
                    
                    if (!$scope.course.baseTrack) {
                        $scope.course.baseTrack = false;
                    }
                    if (!$scope.course.shareWithTeam) {
                        $scope.course.shareWithTeam = false;
                    }
                    $scope.updateClientList();
                });

                $scope.showprogress = false;
                $scope.showtrackbuilder = true;
                $scope.loading = false;
            }

            var updateViewStatus = function() {
                if(!$scope.studentcourse.lessonprogress || $scope.studentcourse.lessonprogress.length == 0) {
                    return true;
                }

                for(var i=0;i < $scope.course.contents.length;i++) {
                    var coursecontent = $scope.course.contents[i];
                    for(var j = 0; j < $scope.studentcourse.lessonprogress.length; j++) {
                        var studentcoursecontent = $scope.studentcourse.lessonprogress[j];
                        if(coursecontent.videoID == studentcoursecontent.lessonID) {
                            $scope.course.contents[i].progress = studentcoursecontent.progress;
                        }
                    }
                }
            }

        	var self = this;

        	if ($stateParams.selectedVideos) {
        		$scope.selectedVideos = $stateParams.selectedVideos;
        		addVideoToTrack();
        	}

        	$scope.addTrack = function () {
        		$scope.course.product = Auth.user.product;
        		console.log("Adding track");

        		Restangular.all('course').post($scope.course).then(function (data) {
        			console.log('Course created :' + data._id);

        			$scope.course			= data;
        			$scope.courseID			= data._id;
        			$scope.course._id		= data._id;
        			$scope.showtrackbuilder = true;

        			$mixpanel.track('Added track');
        		});
        	}

        	$scope.saveContent = function (type) {
        		if (type == 'video') {
        			$scope.saveVideo($scope.courseID);
        		}
        	}

        	$scope.saveVideo = function (courseID) {
        		console.log("Saving video course :" + courseID);

        		$scope.video.courseID = courseID;

        		Restangular.all('video').post($scope.video)
                  .then(function (video) {
                  		console.log('Video lesson created :' + video.title);
                  		$scope.course = Restangular.one("course", $scope.courseID).get().$object;
                  		growl.success('Lesson created successful!');
                  });
        	}

        	$scope.setCourseToInactive = function() {
        		$scope.course.isActive = false;
        		$scope.course.put();
        	}

        	$scope.openDeleteDecisionDialogue = function () {
        		var options = {
        			title			: "Confirm Delete",
        			message			: "Are you sure you want to delete this track? This action cannot be undone.",
        			note			: "Deleting this track will not affect customers who already have this track as a part of their training.",
					confirmText		: "Yes",
        			cancelText		: "Cancel",
        			uiSref			: "customer-manager.dashboard"
        		};

        		CustomModalService.openCustomModal('sm', options, $scope.setCourseToInactive);
        	};

        	$scope.showMessage = function () {
        		$mixpanel.track('Client Copy URL Clicked');
        		growl.success('Onboarding link copied to the clipboard. Please paste it in your thank you email to the customer!');
        	};

        	$scope.fail = function (err) {
        		growl.error(err);
        	}

        	$scope.inviteClient = function () {
        		$scope.student.role = 'client';
        		Restangular.all('student?local.email=' + $scope.student.local.email).getList().then(function (studentslist) {
        			if (studentslist.length > 0) {
        				growl.error('Client email id already exists. Cannot add another track for the same client');
        				return;
        			}

        			if ($scope.course.baseTrack) {
        				var duplicateCourse				= $scope.course;
        				duplicateCourse.baseTrack		= false;
        				duplicateCourse.shareWithTeam	= false;
        				duplicateCourse.author			= $scope.user._id;

        				delete duplicateCourse._id;

        				console.log("Duplicate Course :" + JSON.stringify(duplicateCourse));

        				Restangular.all('course').post(duplicateCourse).then(function (data) {
        					$scope.course = data;
        					Restangular.all('student').post($scope.student).then(function (data1) {
        						createStudentCourse(data1, data._id, true);
        					});
        				});
        			} else {
        				Restangular.all('student').post($scope.student)
                        .then(function (data) {
                        	createStudentCourse(data, $scope.course._id, true);
                        	$mixpanel.track('Invite Client');
                        	$scope.closeClientModal();
                        });
        			}
        		});
                console.log("showtrackbuilder"+$scope.showtrackbuilder);
        	}

        	var createStudentCourse = function (student, courseid, navigate) {
        		$scope.student.courseID				= courseid;
        		$scope.student.studentID			= student._id;
        		$scope.student.email				= student.local.email;
        		$scope.student.product				= Auth.user.product;
        		$scope.student.progress				= "invited";
        		$scope.student.onboardingSpecialist = $scope.student.onboardingSpecialist;
                $scope.student.clientName = $scope.student.local.clientname;

        		console.log('Trying to invite students :' + JSON.stringify($scope.student));

        		Restangular.all('studentcourses').post($scope.student)
					.then(function (data) {
						console.log('Created student course :::' + data._id);

						$mixpanel.track('Invite Client');
						$scope.closeClientModal();

						if (navigate) {
							console.log("Navigating to new track");
							$state.go('customer-manager.trackbuilder', { 'studentCourseID': data._id, 'message': 'Onboarding track created. Please copy the link by clicking the "Copy Invite Link" in the clients tab!' });
						} else {
							$scope.updateClientList();
						}

						growl.success('Onboarding track created. Please copy the link by clicking the "Copy Invite Link" in the clients tab!');
				});
        	};

        	$scope.addVideoToQueue = function (checked, video) {
        		var videoID = video._id
        		console.log("Video ID :" + videoID);

        		if (!checked) {
        			var index = $scope.selectedVideos.indexOf(videoID);
        			$scope.selectedVideos.splice(index, 1);
        		} else if ($scope.selectedVideos.indexOf(videoID) < 0) {
        			$scope.selectedVideos.push(videoID);
        		}

        		console.log("Got event :" + $scope.selectedVideos);
        	};

        	$scope.addVideoToTrack = function (filetype) {
        		if ($scope.course.baseTrack && $scope.course.author != $scope.user._id) {
        			var duplicateCourse				= $scope.course;
        			duplicateCourse.baseTrack		= false;
        			duplicateCourse.shareWithTeam	= false;
        			duplicateCourse.author			= $scope.user._id;

        			delete duplicateCourse._id;

        			console.log("Duplicate Course :" + JSON.stringify(duplicateCourse));

        			Restangular.all('course').post(duplicateCourse).then(function (data) {
        				$scope.course = data;
        				$state.go('customer-manager.trackbuilder', {
        					'courseID': data._id,
        					'selectedVideos': $scope.selectedVideos
        				});
        			});
        		}

        		console.log("Adding these tracks :" + $scope.selectedVideos);

        		$scope.selectedVideos.forEach(function (element, index, array) {

        			$scope.videolessons.forEach(function (videoelement, videoindex, videoarray) {
        				if (videoelement._id == element) {
        					var video1	= videoelement;
        					var content = {
        						type	: filetype,
        						title	: video1.title,
        						videoID	: video1._id
        					};

        					if (!$scope.course.contents) { $scope.course.contents = []; }

        					$scope.course.contents.push(content);
        					console.log("Video : " + JSON.stringify(video1));
        				}
        			});
        		});
                console.log("GOT COURSE11 :"+JSON.stringify($scope.course));
        		$scope.course.put();
        		$scope.selectedVideos = [];
        	};

        	$scope.baseTrack = function (test) {
        		$scope.course.put();
        		$mixpanel.track('BaseTrack Marked');
        	};

        	var getApplicableContentForProducts = function (prod) {
        		var applicableContent = [];
        		if (prod == 'sharefile' || prod == 'rightsignature' || prod == 'demo') {
        			applicableContent.push('sharefile');
        			applicableContent.push('shareconnect');
        			applicableContent.push('rightsignature');
        		} else if (prod == 'shareconnect') {
        			applicableContent.push('shareconnect');
        		} else if (prod == 'podio') {
        			applicableContent.push('podio');
        		} else if (prod == 'addoo') {
        			applicableContent.push('addoo');
        		} else if (prod == 'bollo') {
                    applicableContent.push('bollo');
                }
        		return applicableContent;
        	}

        	getApplicableContentForProducts(Auth.user.product).forEach(function (element, index, array) {
        		Restangular.all("video?product=" + element).getList().then(function (data) {
        			if (!$scope.videolessons) {
        				$scope.videolessons = [];
        			}
        			$scope.videolessons = $scope.videolessons.concat(data);
        			$scope.displayedvideolessons = [].concat($scope.videolessons);
        		});
        	});

        	$scope.resetTextOfElement = function (e) {
        		e.target.contentEditable = false;
        		e.target.innerHTML = $scope.course.title;
        	};

        	$scope.shiftFocusToEdit = function (e) {
        		var elementForFocus,
					range = document.createRange();

        		switch (e.target.id) {
        			case "course-name-edit":
        				elementForFocus = document.getElementById('course-name');
        		};

        		elementForFocus.contentEditable = true;
        		elementForFocus.focus();

        		// Remove all ranges on the window currently selected
        		// then select the content of the element for edit
        		var selection = window.getSelection();
        		selection.removeAllRanges();
        		range.selectNodeContents(elementForFocus)
        		selection.addRange(range);
        	};

        	$scope.submitTitleChangeRequest = function (e) {
        		var keyValue = (e.keyCode === 13 || e.which === 13);

        		if (keyValue) { // if the user presses enter...
        			$scope.course.title = e.target.innerHTML;
        			$scope.course.put();
        			e.target.contentEditable = false;
        		}

        		return !keyValue;
        	};

        	$scope.openVideoListModal = function () {
                $scope.videoModalInstance = $uibModal.open({
                  animation		: true,
                  templateUrl	: 'templates/modals/VideoListModal.html',
                  scope			: $scope
                });
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

        	$scope.openClientModal = function () {
                $scope.clientModalInstance = $uibModal.open({
                  animation		: true,
                  templateUrl	: 'templates/modals/ClientModal.html',
                  scope			: $scope
                });
        	};

        	$scope.closeClientModal = function () {
        		$scope.clientModalInstance.dismiss('cancel');
        	};

        	$scope.createDuplicateTrack = function () {
        		var duplicateCourse = $scope.course;
        		delete duplicateCourse._id;
                delete duplicateCourse.author;
        		Restangular.all('course').post(duplicateCourse).then(function (data) {
        			$state.go('customer-manager.build', { 'courseID': data._id, 'message': 'Duplicate track created successfully' });
        			growl.success('Duplicate track created successfully');
        		});
        	};
    }]);
