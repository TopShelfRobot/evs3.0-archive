(function () {
    angular.module("evReg").controller("TeamPaymentController",
       ["$scope", "$location", "$http", "datacontext", "RegistrationCartModel", "config","StripeService", controller]);

	function controller($scope, $location, $http, datacontext, cartModel, config, stripe) {
        $scope.teamName = cartModel.teamName;
        $scope.waiverSigned = false;
        $scope.isSuggestPayVisible = false;
        $scope.isIndividualVisible = false;
        
        console.log(cartModel.eventureId, cartModel.eventureListId);
        datacontext.eventure.getEventureListById(cartModel.eventureListId)
            .then(function (item) {
                if (item) {
                    $scope.fee = item.currentFee;
                    cartModel.fee = item.currentFee;
                    if (item.listType == 2) {
                        $scope.isIndividualVisible = false;
                    }
                    if (item.listType == 3) {
                        $scope.isSuggestPayVisible = true;
                    }
                }
            });

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
					cartOrder.stripeToken = res.id;
				    $http.post(config.apiPath + "/api/Payment/PostTeam", cartOrder)
						.success(function(result){
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
})();
