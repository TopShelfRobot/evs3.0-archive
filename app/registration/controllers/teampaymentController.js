(function () {
	
	var controllerId = "TeamPaymentController";

	function controller($scope, $location, $http, datacontext, cartModel, config, stripe, common) {
		$scope.teamName = cartModel.teamName;
		$scope.waiverSigned = false;
		$scope.isSuggestPayVisible = false;
		$scope.isIndividualVisible = false;
		
		var promises = [
			datacontext.eventure.getEventureListById(cartModel.eventureListId)
				.then(function (item) {
					if (item) {
						$scope.fee = item.currentFee;
						cartModel.fee = item.currentFee;
						//alert('itemlistingtype: ' + item.eventureListTypeId + 'fee: ' + item.currentFee)
						switch (item.eventureListType) {
							case "TeamSponsored":    //team sponsor
								$scope.isIndividualVisible = true;
								$scope.userPaying = item.currentFee;
								break;
							case "TeamSuggest":   //team suggest
								$scope.isSuggestPayVisible = true;
							
								break;
							case "TeamIndividual":    //team all pays the same
								$scope.isIndividualVisible = true;
								$scope.userPaying = item.currentFee;
								break;
							default:
						}
						//if (item.listingType == 2) {
						//    $scope.isIndividualVisible = false;
						//}
						//if (item.listingType == 3) {
						//    $scope.isSuggestPayVisible = true;
						//}
					}
				})
		];
		
		common.activateController(promises, controllerId);
		
		$scope.allowZeroPayment = cartModel.allowZeroPayment;
		// $scope.waiverSigned = cartModel.waiverSigned;

		$scope.errorMessage = "";

		$scope.checkout = function () {
			var cartOrder = cartModel.order($scope.userPaying);

			//var order = {
			//    'orderAmount': $scope.userPaying,     //cart.getTotalPrice(),
			//    'orderHouseId': config.owner.houseId,
			//    'ownerId': 1,
			//    'regs': cartOrder.regs
			//    //'charges': cart.surcharges
			//};

			//$.blockUI({ message: 'Processing order...' });
			stripe.checkout(cartOrder.orderAmount)
				.then(function(res){
					console.log(res);
					$.blockUI({ message: 'Processing order...' });
					cartOrder.stripeToken = res.id;
				    $http.post(config.apiPath + "api/payment/PostTeam", cartOrder)
				    //$http.post(config.apiPath + "api/payment/PostTeamPayment/testet")
						.success(function (result) {
							console.log("result: " + result);
							$location.path("/receipt/" + result);
						})
						.error(function(err){
							console.error("ERROR:", err.toString());
						})
						.finally(function () {
						 $.unblockUI();
					 });
				});
		};
	}
	
	angular.module("evReg").controller(controllerId,
		["$scope", "$location", "$http", "datacontext", "RegistrationCartModel", "config","StripeService", "common", controller]);
	
})();
