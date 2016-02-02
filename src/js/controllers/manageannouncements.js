angular.module('app')
    .controller('AnnouncementsMngrCtrl', [ '$scope','envService', '$state','Restangular', '$rootScope',
        'Auth','growl','$mixpanel','$filter',
        function ($scope,envService, $state, Restangular,$rootScope, Auth, growl,$mixpanel,$filter) {
            console.log('In AnnouncementsMngrCtrl');

            $scope.announcement = {};
            $scope.announcement.messages = [{message:""}];

            $scope.addMessage = function() {
                console.log("Adding message");
                $scope.announcement.messages.push({message:""})    
                console.log(JSON.stringify($scope.announcement));
            }

            $scope.saveAnnouncement = function() {
                console.log("Saving message");
                Restangular.all('announcement').post($scope.announcement).then(function(data){
                    console.log("saved message");
                    growl.success("Announcement saved successfully..");
                });
            }

        } ]);
