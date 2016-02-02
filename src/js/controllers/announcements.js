angular.module('app')
    .controller('AnnouncementCtrl', [ '$scope','envService', '$state','Restangular', '$rootScope',
        'Auth','growl','$mixpanel','$filter',
        function ($scope,envService, $state, Restangular,$rootScope, Auth, growl,$mixpanel,$filter) {
            console.log('In AnnouncementCtrl');

            Restangular.all("announcement?active=true").getList().then(function(data){
                console.log("Got announements :"+JSON.stringify(data));
                $scope.announcements = data;
            })
        } ]);
