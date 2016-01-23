/**
 * Master Controller
 */

angular.module('app')
    .controller('MasterCtrl', ['$scope', '$cookieStore', MasterCtrl]);

function MasterCtrl($scope, $cookieStore) {
    console.log("MasterCtrl");
    /**
     * Sidebar Toggle & Cookie Control
     */
    UserVoice.push(['showTab', 'classic_widget', {
      mode: 'feedback',
      primary_color: '#cc6d00',
      link_color: '#007dbf',
      forum_id: 341319,
      tab_label: 'Feedback',
      tab_color: '#cc6d00',
      tab_position: 'middle-right',
      tab_inverted: false
    }]);

    var mobileView = 992;

    $scope.getWidth = function() {
        return window.innerWidth;
    };

    $scope.$watch($scope.getWidth, function(newValue, oldValue) {
        if (newValue >= mobileView) {
            if (angular.isDefined($cookieStore.get('toggle'))) {
                $scope.toggle = ! $cookieStore.get('toggle') ? false : true;
            } else {
                $scope.toggle = true;
            }
        } else {
            $scope.toggle = false;
        }

    });

    $scope.toggleSidebar = function() {
        $scope.toggle = !$scope.toggle;
        $cookieStore.put('toggle', $scope.toggle);
    };

    window.onresize = function() {
        $scope.$apply();
    };
}