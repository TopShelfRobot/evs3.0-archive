
;(function(){
	
	function Controller($scope, config, datacontext){
		
		// console.log("config:", config);
		$scope.participant = config.participant;
		
		$scope.submit = function(){
			datacontext.saveChanges()
			.then(function(){
				console.log("saved");
			});
		};
		
		
	}
	
	angular.module("evReg").controller("setParticipant", ["$scope", "config", "datacontext", Controller]);
})();