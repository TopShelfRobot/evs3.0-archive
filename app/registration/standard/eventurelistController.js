(function () {

	var controllerId = "EventureListController";
	angular.module("evReg").controller(controllerId,
					["$scope", "$location", "$routeParams", "config", "CartModel", "datacontext", "common", "AgeService", controller]);

	function controller($scope, $location, $routeParams, config, cart, datacontext, common, dt) {

		//$scope.cart = cartModel;

		var promises = [];

		$scope.listName = cart.regSettings.listName;
		$scope.buttonText = cart.regSettings.partButtonText;
		$scope.listStatement = cart.regSettings.listStatement;
		$scope.registerButtonText = cart.regSettings.registerButtonText;


		promises.push(
			datacontext.eventure.getEventureById($routeParams.eventureId)
				.then(function (item) {
					$scope.eventure = item;
				})
		);

		promises.push(
			datacontext.eventure.getEventureListsByEventureId($routeParams.eventureId)
				.then(function (list) {
					$scope.list = list;
					$scope.selection = $scope.list[0];
				})
		);

		//alert(cart.houseId);
		//alert('cart.houseId');
		promises.push(
		   datacontext.participant.getParticipantsByHouseId(cart.houseId)
					.then(function (list) {
					    //console.log(list)
						$scope.selectedParticipant = list[0];
						$scope.participants = list;
						$scope.age = dt.age($scope.selectedParticipant.dateBirth);
						//console.log($scope.age);
					})
		);

		common.activateController(promises, controllerId);


		$scope.register = function (eventure, eventureList, participant) {
			//mjb cartModel.fee = $scope.selection.currentFee;
			console.log(eventureList.eventureListType);


			if(($scope.selection.minAge && $scope.age < $scope.selection.minAge) ||
				($scope.selection.maxAge && $scope.age > $scope.selection.maxAge)) {
				alert("You do not meet the age restrictions for this event. You must be between " + $scope.selection.minAge + " and " + $scope.selection.maxAge);
			}
			else {
				if (eventureList.eventureListType == "Standard") {   //enum? mjb
					$location.path("/eventure/" + eventure.id + "/list/" + eventureList.id + "/questions")
						.search("uid", participant.id);
				} else {
					$location.path("/eventure/" + eventure.id + "/list/" + eventureList.id + "/team")
						.search("uid", participant.id);
				}
			}

			//if (eventureList.eventureListType == config.eventureListType.standard) {   //enum? mjb
			//	$location.path("/eventure/" + eventure.id + "/list/" + eventureList.id + "/questions")
			//			.search("uid", participant.id);
			//} else {
			//	$location.path("/eventure/" + eventure.id + "/list/" + eventureList.id + "/team")
			//			.search("uid", participant.id);
			//}


		};
	}
})();