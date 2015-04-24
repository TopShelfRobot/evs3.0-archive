(function () {

	var controllerId = "EventureListController";
	angular.module("evReg").controller(controllerId, ["$scope", "$location", "$routeParams", "$http", "config", "CartModel", "datacontext", "common", "AgeService", controller]);

	function controller($scope, $location, $routeParams, $http, config, cart, datacontext, common, dt) {

		$scope.cart = cart;
		$scope.usatMembershipId = '';

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


		    if (($scope.selection.minAge && $scope.age < $scope.selection.minAge) ||
				($scope.selection.maxAge && $scope.age > $scope.selection.maxAge)) {
		        alert("You do not meet the age restrictions for this event. You must be between " + $scope.selection.minAge + " and " + $scope.selection.maxAge);
		    } else {
		        if (eventureList.eventureListType == "Standard") { //enum? mjb
		            $location.path("/eventure/" + eventure.id + "/list/" + eventureList.id + "/questions")
						.search("uid", participant.id);
		        } else {
		            $location.path("/eventure/" + eventure.id + "/list/" + eventureList.id + "/team")
						.search("uid", participant.id);
		        }
		    }
		};
			$scope.verifyUSAT = function (id) {
				var usatObj = {
					'USATNumber': id,
					'email': $scope.selectedParticipant.email
				};
				console.log('USAT', usatObj);
				$http.post(config.apiPath + 'api/transaction/USATVerification', usatObj)
					.success(function (result) {
					    toastr.success('Your USAT Number has been verified!');
					    cart.addSurcharge('USAT Discount', $scope.selection.usatDiscountAmount, 'usat', $scope.selection.id, $scope.selectedParticipant, null)
					    // cart.addSurcharge('USAT Discount',10.00, 'usat', $scope.selection.id, $scope.selectedParticipant, null)
					})
					.error(function (data, status, headers, config) {
						console.log('Error', data);
						toastr.error('Your USAT Number could not be verified. Please try again.');
					})
			};

			//if (eventureList.eventureListType == config.eventureListType.standard) {   //enum? mjb
			//	$location.path("/eventure/" + eventure.id + "/list/" + eventureList.id + "/questions")
			//			.search("uid", participant.id);
			//} else {
			//	$location.path("/eventure/" + eventure.id + "/list/" + eventureList.id + "/team")
			//			.search("uid", participant.id);
			//}


		
	}
})();
