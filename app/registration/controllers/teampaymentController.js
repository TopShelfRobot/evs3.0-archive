(function () {
    angular.module("evReg").controller("TeamPaymentController",
       ["$scope", "$location", "$http", "datacontext", "RegistrationCartModel", "config","StripeService", controller]);
	   
	function controller($scope, $location, $http, datacontext, cartModel, config, stripe) {

        //console.log("cartModel:", cartModel);

        $scope.teamName = cartModel.teamName;

        //$scope.remaining;
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
            console.log('order man!!!!!!!!!:' + cartOrder);
        
            var order = {
                //'orderName': $scope.house.firstName + " " + $scope.house.lastName,
                'orderEmail': 'boone.mike@bitem.com',
                'orderAmount': $scope.userPaying,     //cart.getTotalPrice(),
                'orderHouseId': 13,
                'ownerId': 1,
                'regs': cartOrder.regs   //,
                //'charges': cart.surcharges
            };
        
            //var order = cartModel.order($scope.userPaying);
            console.log('order man:' + order);
			$.blockUI({ message: 'Processing order...' });
            stripe.checkout(order.orderAmount)
				.then(function(res){
					console.log(res);
					order.token = res.id;
					$http.post("/api/Payment/PostTeam", order)
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


        //$scope.checkoutStripe = function () {
        //    // build form
        //    var form = $('.form-stripe');
        //    form.empty();
        //    form.attr("action", config.apiPath + '/api/Payment/PostTeam');
        //    form.attr("method", "POST");
        //    form.attr("style", "display:none;");
        //    console.log($scope.userPaying);
        //    //console.log('order man:' + cartModel.order);
        //    var order = cartModel.order($scope.userPaying);
        //    console.log('order man:' + order);
        
        //    this.addFormFields(form, order);
        //    $("body").append(form);

        //    //// ajaxify form
        //    form.ajaxForm({
        //        success: function (result) {
        //            $.unblockUI();
        //            alert('Order was good nav to receipt number: ' + result);
        //        },
        //        error: function (result) {
        //            $.unblockUI();
        //            alert('Error submitting order: ' + result.statusText);
        //        }
        //    });

        //    var token = function (res) {
        //        var $input = $('<input type=hidden name=stripeToken />').val(res.id);
        //        // show processing message and block UI until form is submitted and returns
        //        $.blockUI({ message: 'Processing order...' });
        //        // submit form
        //        form.append($input).submit();
        //        //this.clearCart = clearCart == null || clearCart;
        //        //form.submit();
        //    };

        //    StripeCheckout.open({
        //        key: 'pk_test_bJMgdPZt8B8hINCMgG2vUDy4',
        //        address: false,
        //        amount: order.orderAmount * 100,  //this.getTotalPrice() * 100, /** expects an integer **/
        //        currency: 'usd',
        //        name: 'Eventure Sports',
        //        description: 'Description',
        //        panelLabel: 'Checkout',
        //        token: token
        //    });
        //};

        //// utility methods
        //$scope.addFormFields = function (form, data) {
        //    if (data != null) {
        //        $.each(data, function (name, value) {
        //            if (value != null) {
        //                var input = $("<input></input>").attr("name", name).val(value);   //.attr("type", "hidden")
        //                form.append(input);
        //            }
        //        });
        //    }
        //};
    }
})();
   
