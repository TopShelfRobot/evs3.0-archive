
;(function(){
	
    function Controller($scope, $http, $location, Stripe, datacontext, logger, cart, config) {

        $scope.isTerms = false;
        $scope.isRefund = false;
        $scope.owner = null;
		
		$scope.couponErrors = "";
		$scope.cart = cart;
		$scope.allowPartialPayment = false;
		$scope.allowZeroPayment = false;
		$scope.submitDisabled = false;
        // cart.cartIsVisible = false;
		
		// initialize it
        datacontext.getOwnerById(config.owner.ownerId)
            .then(function (owner) {
				$scope.owner = owner;
				Stripe.setPublishableKey(owner.stripePublishableKey);
	            $('#terms').popover({ title: "Terms and Conditions", html: true, content: function () { msg = '<div id="popover_content_wrapper"><p>' + owner.termsText + '</p></div>'; return $(msg).html(); }, placement: 'auto', container: 'body', trigger: 'click' });
	            $('#refund').popover({ title: "Refund Policy", html: true, content: function () { msg = '<div id="popover_content_wrapper"><p>' + owner.refundsText + '</p></div>'; return $(msg).html(); }, placement: 'auto', container: 'body', trigger: 'click' });
				
				// Stripe.setPublishableKey(owner.stripePublishableKey);
				
				cart.processCartRules();
            });

        var applyCoupon = function () {

            var apiUrl = config.apiPath + "/api/Coupon/Post";    //mjb
            var source = {
                'couponCode': $scope.couponCode,
                'regs': cart.registrations,
            };

            $http({type: "POST", url: apiUrl, data: source})
				.success(function (result) {
                    if (result.Amount != 0) {
                        cart.removeCoupons();
                        cart.addSurcharge('Coupon: ' + couponCode, result.Amount, 'coupon', cart.currentEventureListId(), cart.currentPartId, result.CouponId);
                        $scope.couponErrors = "";
                    } else {
                        {
                            $scope.couponErrors = result.Message;
                        }
                    }
                })
				.error(function (data, status, headers, config) {
                    $scope.couponErrors = "Coupon Not Found(E1)";
                });
        };

        var stripeSuccessHandler = function (data) {

			// token contains id, last4, and card type
            var token = data.id;

            var apiUrl = config.apiPath + "/api/Payment/Post";    //mjb
            var source = {
                'orderToken': token,
                'orderName': config.regLoginName,
                'orderEmail': config.houseName,
                'orderAmount': cart.getTotalPrice(),
                'orderHouseId': config.houseId,
                'ownerId': config.ownerId,
                'regs': cart.registrations,
                'charges': cart.surcharges
            };
			$scope.submitDisabled = true;
            $http({type: "POST", url: apiUrl, data: source})
				.success(function (data, status, headers, config) {
                    var receiptUrl = '#receipt';
					$scope.submitDisabled = false;
                    // router.navigateTo(receiptUrl);
					
                })
				.error(function (data, status, headers, config) {
                    // var respText = JSON.parse(xhr.responseText);
                    $scope.errorMessage = respText.Message;
					$scope.submitDisabled = false;
                    // $("#overlay").addClass("hidden");
                    // $form.find('button').prop('disabled', false);
                });
        };
		
        var stripeErrorHandler = function (data, status) {

            var $form = $('#payment-form');
            alert('error on card ' + data.error.message);
            // Show the errors on the form
            //logger.log('error' + response.error.message, null, 'confirm', true);
            $("#overlay").addClass("hidden");
            $form.find('.payment-errors').text(response.error.message);

            $form.find('button').prop('disabled', false);
            //var url = '#receipt';
            //router.navigateTo(url);
        };
		
        $scope.completeRegistration = function(){
            var $form = $('#payment-form');

			$scope.errorMessage = "";  //clears any previous errors
			$scope.submitDisabled = true; // Disable the submit button to prevent repeated clicks

			stripeSuccessHandler('asdfasdfasdfasf');
				//             Stripe.createToken($form)
				// .then(stripeSuccessHandler)
				// .catch(stripeErrorHandler)
				// .finally(function(){
				// 	// $("#overlay").removeClass("hidden");
				// 	$scope.submitDisabled = false;
				// });
        };

        $scope.isConfirm = function () {
            return $scope.isTerms && $scope.isRefund;
        };

        $scope.title = 'Event';
    }
	
	angular.module("evReg").controller("ConfirmController", ["$scope", "$http", "$location", "StripeService", "datacontext", "logger", "CartModel", "config", Controller]);
})();