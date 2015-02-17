
;(function(){
	
	var controllerId = "viewReceipt";

    function Controller($scope, $window, $routeParams, config, datacontext, common) {

        $scope.receipt = {};

        $scope.title = "Registration Complete";
        $scope.registrationId = $routeParams.registrationId;
		
		var promises = [
	        datacontext.team.GetTeamInfoByRegistrationId($scope.registrationId)
	            .then( function(data) {
					$scope.receipt = data;
	                return $scope.receipt;
	            })
		];
        
		common.activateController(promises, controllerId);

    }

    angular.module("evReg").controller(controllerId, ["$scope", "$window", "$routeParams", "config", "datacontext", "common", Controller]);
})();
