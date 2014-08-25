;(function(){
	
	var controllerId = "EditTeam";
	function Controller($scope, $location, $routeParams, common, datacontext){
		
        function activate() {
            var promises = [
				function(){
					
				}
			];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated Dashboard View'); });
        }
		
		activate();
	}
	
	angular.module("evReg").controller(controllerId, ["$scope", "$location", "$routeParams", "common", "datacontext", Controller]));
})();