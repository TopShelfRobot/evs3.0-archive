(function () {

	var controllerId = "EventureListController";
	angular.module("evReg").controller(controllerId,
					["$scope", "$location", "$routeParams", "config", "CartModel", "datacontext", "common", controller]);

	function controller($scope, $location, $routeParams, config, cart, datacontext, common) {

		//$scope.cart = cartModel;

		var promises = [];

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

		promises.push(
			datacontext.participant.getParticipantsByHouseId(cart.houseId)
				.then(function (list) {
					$scope.selectedParticipant = list[0];
					$scope.participants = list;
				})
		);

		common.activateController(promises, controllerId);


		$scope.register = function (eventure, eventureList, participant) {
			//mjb cartModel.fee = $scope.selection.currentFee;
			console.log(eventureList.eventureListType);
			if (eventureList.eventureListType == "Standard") {   //enum? mjb
			    $location.path("/eventure/" + eventure.id + "/list/" + eventureList.id + "/questions")
						.search("uid", participant.id);
			} else {
			    $location.path("/eventure/" + eventure.id + "/list/" + eventureList.id + "/team")
						.search("uid", participant.id);
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
