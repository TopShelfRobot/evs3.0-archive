//;(function(){

//    var controllerId = "orderReceipt";

//    function controller($scope, $routeParams, $location, $anchorScroll, config, datacontext, common) {
       
//        $scope.receipt = {};

//        $scope.title = "Registration Complete";
//        $scope.orderId = $routeParams.orderId;
        
//        var promises = [
//            datacontext.registration.getOrderById($scope.orderId)
//                .then(function (data) {
//                    alert('this far dc');
//                    return $scope.receipt = data;
//                })
//        ];
//        common.activateController(promises, controllerId);
//    }

//    angular.module("evReg").controller(controllerId, ["$scope", "$routeParams", "$location", "$anchorScroll", "config", "datacontext", "CartModel", "common", controller]);

//})();

(function () {

    var controllerId = "orderReceipt";

    function Controller($scope, $window, $routeParams, config, datacontext, common) {

        $scope.receipt = {};

        $scope.title = "Registration Complete";
        //$scope.paymentId = $routeParams.paymentId;
        $scope.orderId = $routeParams.orderId;
        alert($scope.orderId);

        var promises = [
	        datacontext.registration.getOrderById($scope.orderId)
	            .then(function (data) {
	                return $scope.receipt = data;
	            })
        ];

        common.activateController(promises, controllerId);

    }

    angular.module("evReg").controller(controllerId, ["$scope", "$window", "$routeParams", "config", "datacontext", "common", Controller]);
})();
