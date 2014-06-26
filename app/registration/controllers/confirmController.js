
;(function(){
	
    function Controller($scope, $http, $location, Stripe, datacontext, logger, cart, config) {

        $scope.isTerms = false;
        $scope.isRefund = false;
        $scope.owner = null;
		
		$scope.couponErrors = "";
		$scope.cart = cart;
		$scope.allowPartialPayment = false;
		$scope.allowZeroPayment = false;
        // cart.cartIsVisible = false;
		
		// initialize it
        datacontext.getOwnerById(config.owner.ownerId)
            .then(function (owner) {
				$scope.owner = owner;
	            $('#terms').popover({ title: "Terms and Conditions", html: true, content: function () { msg = '<div id="popover_content_wrapper"><p>' + owner.termsText + '</p></div>'; return $(msg).html(); }, placement: 'auto', container: 'body', trigger: 'click' });
	            $('#refund').popover({ title: "Refund Policy", html: true, content: function () { msg = '<div id="popover_content_wrapper"><p>' + owner.refundsText + '</p></div>'; return $(msg).html(); }, placement: 'auto', container: 'body', trigger: 'click' });
				
				// Stripe.setPublishableKey(owner.stripePublishableKey);
				
				cart.processCartRules();
            });

		
        $scope.submit = function(){
            var $form = $('#payment-form');

            // Disable the submit button to prevent repeated clicks
            $form.find('button').prop('disabled', true);

            Stripe.createToken($form)
				.then(stripeResponseHandler);
        }

        var applyCoupon = function () {
            //logger.log('validating', null, 'confirm', true);

            var apiUrl = config.apiPath + "/api/Coupon/Post";    //mjb
            var source = {
                'couponCode': $scope.couponCode,
                'regs': cart.registrations,
            };

            $http({type: "POST", url: apiUrl, data: source})
				.then(function (result) {
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
				.error(function (xhr, textStatus, errorThrown) {
                    $scope.couponErrors = "Coupon Not Found(E1)";
                });
        };

        var stripeResponseHandler = function (status, response) {

            $("#overlay").removeClass("hidden");

            var $form = $('#payment-form');
            //alert('in stripe response handle');
            if (response.error) {
                alert('error on card ' + response.error.message);
                // Show the errors on the form
                //logger.log('error' + response.error.message, null, 'confirm', true);
                $("#overlay").addClass("hidden");
                $form.find('.payment-errors').text(response.error.message);

                $form.find('button').prop('disabled', false);
                //var url = '#receipt';
                //router.navigateTo(url);
            } else {
                //alert('card is approved');
                //logger.log('card is approved', null, 'confirm', true);
                $form.find('.payment-errors').text('');  //clears any previous errors
                // token contains id, last4, and card type
                var token = response.id;
                //alert('tok: ' + token);
                // Insert the token into the form so it gets submitted to the server
                //$form.append($('<input type="hidden" name="stripeToken" />').val(token));
                // and re-submit
                // $form.get(0).submit();

                //logger.log('lets try to  save reg', null, 'confirm', true);

                var apiUrl = config.apiPath + "/api/Payment/Post";    //mjb
                var source = {
                    'orderToken': token,
                    'orderName': config.regLoginName,
                    'orderEmail': config.houseName,
                    'orderAmount': cart.getTotalPrice(),
                    'orderHouseId': config.houseId,
                    'ownerId': config.ownerId,
                    'regs': cart.registrations(),
                    'charges': cart.surcharges()
                };
                //logger.log('NO error yet', null, 'confirm jonsify', true);

                $.ajax({
                    type: "POST",
                    dataType: "json",
                    url: apiUrl,
                    data: source,
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader("Accept", "application/json");  // explicitly request JSON
                    },
                    success: function (result) {
                        //alert('post returns success' + result);
                        var receiptUrl = '#receipt';
                        // router.navigateTo(receiptUrl);
						
                    },
                    error: function (xhr, textStatus, errorThrown) {
                        //alert('fail' + errorThrown.responseText);
                        //alert('error4' + textStatus);  //value is error
                        //alert('error5' + errorThrown);  //valiue is internal server erro

                        var respText = JSON.parse(xhr.responseText);
                        $form.find('.payment-errors').text(respText.Message);
                        $("#overlay").addClass("hidden");
                        $form.find('button').prop('disabled', false);
                    }
                });
            }
        };

        $scope.isConfirm = function () {
            return $scope.isTerms && $scope.isRefund;
        };

        $scope.title = 'Event';
    }
	
	angular.module("evReg").controller("ConfirmController", ["$scope", "$http", "$location", "StripeService", "datacontext", "logger", "CartModel", "config", Controller]);
})();