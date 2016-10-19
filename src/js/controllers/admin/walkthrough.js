angular.module('app')
    .controller('WalkthroughCtrl', ['$scope', 'envService', '$state', 'Restangular', '$rootScope',
        'Auth', 'growl', '$mixpanel', '$filter','$stateParams',
        function ($scope, envService, $state, Restangular, $rootScope, Auth, growl, $mixpanel, $filter,$stateParams) {
 
            console.log("In WalkthroughCtrl");
            $scope.walkthroughID = $stateParams.walkthroughID;

            Restangular.one('walkthrough',$scope.walkthroughID).get().then(function (data) {
                console.log("Data :"+JSON.stringify(data));
                $scope.walkthrough = data;
             });

            $scope.tableCallbacks = {
                dropped : function (event) { // drag and drop event of the table...
                    //doing nothing right now
                }
            };

            $scope.save = function() {
                $scope.walkthrough.put();
                growl.success('Saved successfully!');
            }
        }]);
