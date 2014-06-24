
;(function(){
	
	function Controller($scope, config, datacontext){
		
		// console.log("config:", config);
		datacontext.getParticipantById(config.owner.houseId)
			.then(function(part){
				$scope.participant = part;
			});
		
		$scope.submit = function(){
			datacontext.saveChanges()
			.then(function(){
				console.log("saved");
			});
		};
		
		
	}
	
	angular.module("evReg").controller("setParticipant", ["$scope", "config", "datacontext", Controller]);
})();