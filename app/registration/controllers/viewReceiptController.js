
;(function(){

    function Controller($scope, $window, $routeParams, config, datacontext){

        $scope.title = "Registration Complete";
        $scope.teamMemberGuid = $routeParams.teamMemberGuid;
        // $scope.orderId = $routeParams.orderId; WILL HAPPEN EVENTUALLY

        //datacontext.team.getTeamMemberPaymentInfoByOrderId($scope.orderId); //WILL HAPPEN EVENTUALLY

        datacontext.team.getTeamMemberPaymentInfoByTeamMemberGuid($scope.teamMemberGuid)
            .then( function(data) {
                return $scope.receipt = data;
            });

    }

    angular.module("evReg").controller("viewReceipt", ["$scope", "$window", "$routeParams", "config", "datacontext", Controller]);
})();
