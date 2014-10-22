;(function(){

    var controllerId = "orderReceipt";

    function Controller($scope, $routeParams, datacontext, common) {

        $scope.receipt = {};

        $scope.title = "Registration Complete";
        $scope.orderId = $routeParams.orderId;

        var promises = [
            datacontext.registration.getOrderById($scope.orderId)
                .then( function(data) {
                    return $scope.receipt = data;
                })
        ];

        common.activateController(promises, controllerId);

    }

    angular.module("evReg").controller(controllerId, ["$scope", "$window", "$routeParams", "config", "datacontext", "common", Controller]);
})();
