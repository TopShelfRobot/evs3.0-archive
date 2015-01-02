(function () {
	
	var controllerId = "TeamPaymentController";

	function controller($scope, $location, $http, $modal, datacontext, cartModel, config, stripe, common) {
		$scope.teamName = cartModel.teamName;
		$scope.waiverSigned = false;
		$scope.isSuggestPayVisible = false;
		$scope.isIndividualVisible = false;
		$scope.isLotteryVisible = false;

		$scope.isUserPaying = false;

		$scope.confirmButtonText = cartModel.confirmButtonText;

		var promises = [
			datacontext.eventure.getEventureListById(cartModel.eventureListId)
				.then(function (item) {
					if (item) {
						$scope.fee = item.currentFee;
						$scope.paymentTerms = item.paymentTerms;
						cartModel.fee = item.currentFee;
						//alert('itemlistingtype: ' + item.eventureListTypeId + 'fee: ' + item.currentFee)
						switch (item.eventureListType) {
							case "TeamSponsored":    //team sponsor
								$scope.isIndividualVisible = true;
								$scope.userPaying = item.currentFee;
								break;
							case "TeamSuggest":   //team suggest
							    $scope.isSuggestPayVisible = true;
							    $scope.userPaying = 0;
							
								break;
							case "TeamIndividual":    //team all pays the same
								$scope.isIndividualVisible = true;
								$scope.userPaying = item.currentFee;
								break;
							case "Lottery":    //Captain pays all or nothing at registration
								$scope.isLotteryVisible = true;
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

		$scope.open = function () {
			var modalInstance = $modal.open({
				templateUrl: 'termsAndConditions.html',
				size: 'lg',
				backdrop: 'static',
				controller: 'TermsModalInstance'
			});

			modalInstance.result.then(function () { $scope.checkout(); });

		};

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

			console.log($scope.userPaying);

			if ($scope.userPaying > 0) {
			    stripe.checkout(cartOrder.orderAmount)
                    .then(function (res) {
                        console.log(res);
                        $.blockUI({ message: 'Processing order...' });
                        cartOrder.stripeToken = res.id;
                        $http.post(config.apiPath + "api/payment/PostTeam", cartOrder)
                        //$http.post(config.apiPath + "api/payment/PostTeamPayment/testet")
                            .success(function (result) {
                                console.log("result: " + result);
                                $location.path("/receipt/" + result);
                            })
                            .error(function (err) {
                                console.error("ERROR:", err.toString());
                            })
                            .finally(function () {
                                $.unblockUI();
                            });
                    });
			}
			else
			{
			    //console.log(res);
			    $.blockUI({ message: 'Processing order...' });
			   // cartOrder.stripeToken = res.id;
			    $http.post(config.apiPath + "api/payment/PostTeam", cartOrder)
                //$http.post(config.apiPath + "api/payment/PostTeamPayment/testet")
                    .success(function (result) {
                        console.log("result: " + result);
                        $location.path("/receipt/" + result);
                    })
                    .error(function (err) {
                        console.error("ERROR:", err.toString());
                    })
                    .finally(function () {
                        $.unblockUI();
                    });
			}
		};
	}
	
	angular.module("evReg").controller(controllerId,
		["$scope", "$location", "$http", "$modal", "datacontext", "RegistrationCartModel", "config","StripeService", "common", controller]);
	
})();
