angular.module('app')
    .controller('CustomerCareDashboardController', ['$scope', 'Restangular', 'Auth',
        function ($scope, Restangular, Auth) {

        	$scope.auth				= Auth;
        	$scope.allUsers			= [];
        	$scope.activeUsers		= [];
        	$scope.vulnerableUsers	= [];
        	$scope.tracksPending	= 0;
        	$scope.tracksStarted	= 0;
        	$scope.tracksCompleted	= 0;
        	$scope.selected			= false;

        	/*
				Comparator function for sorting users in ascending order based upon 
				activity score. Requires each parameter is expected the have the 
				form { id, activityScore }
			*/
        	$scope.sortActiveUsersByScore = function (userA, userB) {
        		if (userA.activityScore < userB.activityScore)
        			return -1;
        		else if (userA.activityScore > userB.activityScore)
        			return 1;
        		else
        			return 0;
        	}

        	/*
				Comparator function for sorting users in ascending order based upon 
				activity score. A score counts as "greater" if the score is less 
				than that of the score to which it is compared to prioritize "bad" 
				users. Requires each parameter  is expected the have the form 
				{ id, activityScore }
			*/
        	$scope.sortVulnerableUsersByScore = function (userA, userB) {
        		if (userA.activityScore < userB.activityScore)
        			return 1;
        		else if (userA.activityScore > userB.activityScore)
        			return -1;
        		else
        			return 0;
        	}

        	/*
				This method does not handle duplicate entries and expects data to be
				singular
			*/
        	$scope.aggregateUserLists = function (report) {
        		var activeUsers		= report.activeUserList,
					inactiveUsers	= report.inactiveUserList,
					vulnerableUsers = report.vulnerableUserList;

        		return activeUsers.concat(inactiveUsers, vulnerableUsers);
        	}

        	Restangular.all("dashboardreport").getList().then(function (data) {
        		var reports = data.filter(function (datum) {
        				return datum.formattedCreateDate === new Date().toDateString();
        			}),
					report = reports[0];

        		$scope.tracksPending	= report.tracksPending;
        		$scope.tracksStarted	= report.tracksStarted;
        		$scope.tracksCompleted	= report.tracksCompleted;
        		$scope.activeUsers		= report.activeUserList.sort($scope.sortActiveUsersByScore).slice(0, 10);
        		$scope.vulnerableUsers	= report.vulnerableUserList.sort($scope.sortVulnerableUsersByScore).slice(0, 10);
        		$scope.allUsers			= $scope.aggregateUserLists(report);
        	});
        }]);
