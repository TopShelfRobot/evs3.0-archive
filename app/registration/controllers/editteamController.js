;(function(){
	
	var controllerId = "EditTeamController";
	function Controller($scope, $location, $routeParams, common, datacontext){
		
		var team = null;
		function getTeam(){
			return datacontext.team.getTeamById($routeParams.teamId)
				.then(function(team){
					console.log("Team:", team);
					$scope.team = {};
					$scope.team.teamName = team.name;
					$scope.players = [];
					var player;
					for(var i = 0; i < team.teamMembers.length; i++){
						player = {name: team.teamMembers[i].name, email: team.teamMembers[i].email};
						$scope.players.push(player);
					}
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