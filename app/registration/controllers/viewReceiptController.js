
;(function(){

    function Controller($scope, $window, $routeParams, config, datacontext){

        $scope.title = "Registration Complete";
        $scope.teamMemberGuid = $routeParams.teamMemberGuid;
        
        datacontext.team.getTeamMemberPaymentInfoByTeamMemberGuid($scope.teamMemberGuid)
            .then( function(data) {
                return $scope.receipt = data;
            });

    }

    angular.module("evReg").controller("viewReceipt", ["$scope", "$window", "$routeParams", "config", "datacontext", Controller]);
})();
