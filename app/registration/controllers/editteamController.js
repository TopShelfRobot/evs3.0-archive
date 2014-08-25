;(function(){
	
	var controllerId = "EditTeamController";
	function Controller($scope, $location, $routeParams, common, datacontext){
		
		function getTeam(){
			return datacontext.team.getTeamById($routeParams.teamId)
				.then(function(team){
					$scope.team = team;
				});
		}
		
        function activate() {
            var promises = [
				getTeam()
			];
            common.activateController(promises, controllerId)
                .then(function () { 
					console.log('Activated Dashboard View'); 
				})
				.finally(function(){
					console.log("done");
				});
        }
		activate();
	}
	
	angular.module("evReg").controller(controllerId, ["$scope", "$location", "$routeParams", "common", "datacontext", Controller]);
})();