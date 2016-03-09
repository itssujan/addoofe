angular.module('app')
    .controller('LeadsCtrl', [ '$scope', '$state','Restangular', '$rootScope','$cookieStore','growl',
        '$location', '$mixpanel','$filter','Auth',
        function ($scope, $state, Restangular,$rootScope,$cookieStore, growl, $location, $mixpanel,$filter,Auth) {
            console.log('In Inviteusers controller');
            $scope.sendEvent = function (event) {
                $mixpanel.track(event, {
                    "Email": $scope.clientemail
                });
            };
            
            $scope.sendEvent("Vist to leads page");

            // Get Leads..
            Restangular.all("crosssaleleads?salesRep="+Auth.user._id+"&populate=opportunityID&sort=-createdOn").getList().then(function (data) {
                $scope.leads = data;
                $scope.displayedLeads = [].concat($scope.leads);
            });

        } ]);