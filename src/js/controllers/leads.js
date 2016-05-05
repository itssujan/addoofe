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
            if(Auth.user.product == 'shareconnect' && Auth.user.role == 'customer-onboarding-specialist') {
                console.log("Am here");
                Restangular.all("crosssaleleads?feature=connector&populate=opportunityID&sort=-createdOn").getList().then(function (data) {
                    $scope.leads = data;
                    $scope.displayedLeads = [].concat($scope.leads);
                });
            } else {
                console.log("Am here11 :"+JSON.stringify(Auth.user));
                Restangular.all("crosssaleleads?salesRep="+Auth.user._id+"&populate=opportunityID&sort=-createdOn").getList().then(function (data) {
                    $scope.leads = data;
                    $scope.displayedLeads = [].concat($scope.leads);
                });
            }    
        } ]);