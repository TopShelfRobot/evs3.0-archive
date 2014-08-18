(function () {
    angular.module("evReg").controller("TeamPaymentController",
       ["$scope", "$location", "$http", "datacontext", "RegistrationCartModel", "config","StripeService", controller]);
	   
	function controller($scope, $location, $http, datacontext, cartModel, config, stripe) {
        $scope.teamName = cartModel.teamName;

        console.log(cartModel.eventureId, cartModel.eventureListId);
        datacontext.eventure.getEventureListById(cartModel.eventureListId)
            .then(function (item) {
                if (item)
                    $scope.remaining = item.currentFee - cartModel.currentlyPaid;
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
            stripe.checkout(order.orderAmount)
				.then(function(res){
					console.log(res);
					order.token = res.id;
				    $http.post(config.apiPath + "/api/Payment/PostTeam", cartOrder)
						.success(function(data){
							console.log("success");
						})
						.error(function(err){
							console.error("ERROR:", err.toString());
						})
						.finally(function(){
							$.unblockUI();
						});
				});
        };
    }
})();
   
