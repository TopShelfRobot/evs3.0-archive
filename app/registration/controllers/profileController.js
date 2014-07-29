
;(function(){
	
	function Controller($scope, config, datacontext){
		
		datacontext.getParticipantById(config.owner.houseId)
			.then(function(participant){
				$scope.participant = participant;
			});
		
		$scope.save = function(){
			datacontext.saveChanges()
				.then(function(){
					console.log("saved");
				});
		};
	}
	
	angular.module("evReg").controller("UserProfile", ["$scope", "config", "datacontext", Controller]);
})();