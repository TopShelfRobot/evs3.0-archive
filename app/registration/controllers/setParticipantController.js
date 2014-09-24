
;(function(){
	
	function Controller($scope, $routeParams, $window, config, datacontext){
		
		// console.log("config:", config);
		// $scope.participant = config.participant;
		datacontext.getParticipantById($routeParams.partId)
			.then(function(part){
				$scope.participant = part;
			});
		
		$scope.submit = function(){
			datacontext.save()
			.then(function(){
				$window.history.back();
				console.log("saved");
			});
		};
		
		
	}
	
	angular.module("evReg").controller("setParticipant", ["$scope", "$routeParams", "$window", "config", "datacontext", Controller]);
})();