
;(function(){

	var controllerId = "AddUserProfile";

	function Controller($scope, $location, $rootElement, config, datacontext, cart, userAgent, authService, common){

		$scope.participant = {};

		$scope.title = 'Create Your Participant Profile';

		$scope.date = {
			dateBirth: ''
		};

		$scope.participant.email = authService.authentication.userName;

		$scope.formHolder = {};
		$scope.isAdmin = false;
		var pathName = location.pathname;
		console.log('PathName', pathName);
		if (pathName === '/dash.html') {
			console.log('pathName evaulated to true');
			$scope.isAdmin = true;
		}

		$scope.submit = function(){

			if ($scope.formHolder.participantForm.$valid) {
				// Submit as normal
				var newPart = datacontext.participant.createProfile($scope.participant.email);

				for(var key in $scope.participant){
					newPart[key] = $scope.participant[key];
				}
				$scope.date.dateBirth = moment($scope.date.dateBirth).toISOString();
				newPart.dateBirth = $scope.date.dateBirth;
				datacontext.save()
					.then(function(){
					    console.log("saved:", newPart);
						newPart.houseId = newPart.id;
						return datacontext.save();
					})
					.then(function(){
						cart.houseId = newPart.houseId;
						userAgent.logAgentInfo(config.owner.ownerId, newPart.id, 'new');  //log browner/ip
						//config.owner.newId = true;  //whg no idea what bill was doing here. also on man reg. 44 : 19, 44 : 17
						//$location.path('/eventure');
						$location.path(cart.navUrl);
					});
			} else {
				toastr.options = {
					'positionClass': 'toast-top-right'
				};
				toastr.error('Please provide all requested information.');
			}

		};

	}

	angular.module("evReg").controller(controllerId, ["$scope", "$location", "$rootElement", "config", "datacontext", "CartModel", "UserAgent", "authService", "common", Controller]);
})();
