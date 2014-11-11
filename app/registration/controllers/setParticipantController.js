
;(function(){
	
	var controllerId = "setParticipant";
	
	function Controller($scope, $routeParams, $window, config, datacontext, common){
		$scope.participant = {};

		var promises = [
			datacontext.participant.getParticipantById($routeParams.partId)
				.then(function(part){
					$scope.participant = part;
					$scope.date.dateBirth = moment($scope.participant.dateBirth).format('YYYY-MM-DD');
					return $scope.participant;
				})
		];

		$scope.date = {
			dateBirth: '1993-07-03'
		};
		
		common.activateController(promises, controllerId);
		
		$scope.submit = function(){
			$scope.date.dateBirth = moment($scope.date.dateBirth).toISOString();
			$scope.participant.dateBirth = $scope.date.dateBirth;
			datacontext.save()
			.then(function(){
				$window.history.back();
				console.log("saved");
			});
		};
		
		//$scope.dateOptions = {
		//	'year-format': "'yy'",
		//	'starting-day': 1,
		//	showWeeks: 'false'
		//};
		//
		//$scope.formats = ['MM-dd-yyyy', 'yyyy/MM/dd', 'shortDate'];
        //
		//$scope.format = $scope.formats[0];
		//
		//$scope.today = function () {
		//	$scope.participant.dateBirth = new Date();
		//};
        //
		//$scope.open = function($event, open) {
		//	$event.preventDefault();
		//	$event.stopPropagation();
		//	$scope[open] = true;
		//};
	}
	
	angular.module("evReg").controller(controllerId, ["$scope", "$routeParams", "$window", "config", "datacontext", "common", Controller]);
})();