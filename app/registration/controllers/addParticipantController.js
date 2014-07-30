
;(function(){
	
	function Controller($scope, config, datacontext){
		
		// console.log("config:", config);
		$scope.participant = config.participant;
		
		$scope.title = "Add A Participant";
		$scope.subTitle = "Adding a participant to your account is easy, just enter their information below.";
		$scope.buttonText = "Add Now";
		
		
		$scope.submit = function(){
			datacontext.saveChanges()
			.then(function(){
				console.log("saved");
			});
		};
		
		
	}
	
	angular.module("evReg").controller("addParticipant", ["$scope", "config", "datacontext", Controller]);
})();