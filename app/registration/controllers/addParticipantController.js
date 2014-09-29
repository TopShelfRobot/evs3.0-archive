
;(function(){
	
	var controllerId = "addParticipant";

	function Controller($scope, $window, config, datacontext, common){

		// console.log("config:", config);
		$scope.participant = config.participant;

		$scope.title = "Add A Participant";
		$scope.subTitle = "Adding a participant to your account is easy, just enter their information below.";
		$scope.buttonText = "Add Now";

		$scope.participant = {
			city: null,
			dateBirth: null,
			email: null,
			firstName: null,
			gender: null,
			houseId: config.owner.houseId,
			lastName: null,
			ownerId: config.owner.ownerId,
			phoneMobile: null,
			state: null,
			street1: null,
			zip: null,
		};

		$scope.datePicker = {
			opened : false
		};
		
		$scope.dateOptions = {
			'year-format': "'yy'",
			'starting-day': 1,
			showWeeks: 'false'
		};

		var formats = ['MM-dd-yyyy', 'yyyy/MM/dd', 'shortDate'];
		$scope.format = formats[0];
		$scope.open = function($event) {
			$event.preventDefault();
			$event.stopPropagation();

			$scope.datePicker.opened = true;
		};

			
		var promises = [];
		promises.push(
			datacontext.participant.getParticipantById(config.owner.houseId)
				.then(function(owner){
					for(key in owner){
						if(key == "city"
							|| key == "phoneMobile" || key == "state" || key == "street1"
							|| key == "zip" || key == "email"){
							$scope.participant[key] = owner[key];
						}
					}
				})
		);
		common.activateController(promises, controllerId);

		$scope.submit = function(){

			var newPart = datacontext.participant.createParticipant($scope.participant.ownerId, $scope.participant.houseId, $scope.participant.email)

			for(key in $scope.participant){
				newPart[key] = $scope.participant[key];
			}
			datacontext.save()
				.then(function(){
					console.log("saved");
					$window.history.back();
				});
		};


	}

	angular.module("evReg").controller(controllerId, ["$scope", "$window", "config", "datacontext", "common", Controller]);
})();
