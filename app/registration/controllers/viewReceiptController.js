
;(function(){
	
	var controllerId = "viewReceipt";

    function Controller($scope, $window, $routeParams, config, datacontext, common) {

        $scope.receipt = {};

        $scope.title = "Registration Complete";
        $scope.paymentId = $routeParams.paymentId;
		
		var promises = [
	        datacontext.team.getTeamMemberPaymentInfoByPaymentId($scope.paymentId)
	            .then( function(data) {
	                return $scope.receipt = data;
	            })
		];
        
		common.activateController(promises, controllerId);

    }

    angular.module("evReg").controller(controllerId, ["$scope", "$window", "$routeParams", "config", "datacontext", "common", Controller]);
})();
