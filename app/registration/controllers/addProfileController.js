
;(function(){
	
	var controllerId = "AddUserProfile";

	function Controller($scope, $window, config, datacontext, common){

		$scope.participant = {};
		
		// $scope.participant = datacontext.participant.createProfile()

		$scope.date = {
			dateBirth: '1993-07-03'
		};

		$scope.submit = function(){
			
			var newPart = datacontext.participant.createProfile($scope.participant.email)

			for(key in $scope.participant){
				newPart[key] = $scope.participant[key];
			}
			$scope.date.dateBirth = moment($scope.date.dateBirth).toISOString();
			$scope.participant.dateBirth = $scope.date.dateBirth;
			datacontext.save()
				.then(function(){
					console.log("saved:", newPart);
					newPart.houseId = newPart.id;
					return datacontext.save();	
				})
				.then(function(){
					config.owner.houseId = newPart.houseId;
					config.owner.newId = true;
					$window.history.back();
				});
		};

		//$scope.today = function () {
		//	$scope.participant.dateBirth = new Date();
		//};
        //
		//$scope.today();
        //
		//$scope.open = function($event, open) {
		//	$event.preventDefault();
		//	$event.stopPropagation();
		//	$scope[open] = true;
		//};
		//
		//$scope.disableEmail = false;
        //
		//$scope.dateOptions = {
		//	'year-format': "'yy'",
		//	'starting-day': 1,
		//	showWeeks: 'false'
		//};
        //
		//$scope.formats = ['MM-dd-yyyy', 'yyyy/MM/dd', 'shortDate'];
        //
		//$scope.format = $scope.formats[0];

	}

	angular.module("evReg").controller(controllerId, ["$scope", "$window", "config", "datacontext", "common", Controller]);
})();
