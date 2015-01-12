(function () {
    'use strict';

    var controllerId = 'orderReceipt';

    function Controller($scope, $routeParams, datacontext, cart, common) {

        $scope.receipt = {};

        $scope.title = 'Registration Complete';
        //$scope.paymentId = $routeParams.paymentId;
        $scope.orderId = $routeParams.orderId;
        //alert($scope.orderId);

        var promises = [
	        datacontext.registration.getOrderById($scope.orderId)
	            .then(function (data) {
	                $scope.receipt = data;
                    return $scope.receipt;
	            })
        ];

        common.activateController(promises, controllerId);

    }

    angular.module("evReg").controller(controllerId, ['$scope', '$routeParams', 'datacontext', 'CartModel', 'common', Controller]);
})();
