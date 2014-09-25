
;(function(){
	
	var controllerId = "setParticipant";
	
	function Controller($scope, $routeParams, $window, config, datacontext, common){
		
		var promises = [
			datacontext.getParticipantById($routeParams.partId)
				.then(function(part){
					$scope.participant = part;
				})
		];
		
		common.activateController(promises, controllerId);
		
		$scope.submit = function(){
			datacontext.saveChanges()
			.then(function(){
				$window.history.back();
				console.log("saved");
			});
		};
	}
	
	angular.module("evReg").controller(controllerId, ["$scope", "$routeParams", "$window", "config", "datacontext", "common", Controller]);
})();