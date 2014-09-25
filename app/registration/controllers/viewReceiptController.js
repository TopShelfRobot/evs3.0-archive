
;(function(){
	
	var controllerId = "viewReceipt";

    function Controller($scope, $window, $routeParams, config, datacontext, common) {

        $scope.receipt = {};

        $scope.title = "Registration Complete";
        $scope.teamMemberGuid = $routeParams.teamMemberGuid;
		
		var promises = [
	        datacontext.team.getTeamMemberPaymentInfoByTeamMemberGuid($scope.teamMemberGuid)
	            .then( function(data) {
	                return $scope.receipt = data;
	            })
		];
        
		common.activateController(promises, controllerId);

    }

    angular.module("evReg").controller(controllerId, ["$scope", "$window", "$routeParams", "config", "datacontext", "common", Controller]);
})();
