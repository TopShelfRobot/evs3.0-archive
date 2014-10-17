
(function() {
    'use strict';
	
	var controllerId = "ConfirmController";
	
    function Controller($scope, $http, $location, $q, stripe, datacontext, logger, cart, config, common) {

        $scope.isTerms = false;
        $scope.isRefund = false;
        $scope.owner = null;
		
        $scope.couponErrors = "";
        $scope.cart = cart;
        $scope.allowPartialPayment = false;
        $scope.allowZeroPayment = false;
	
        // initialize it
        $scope.submitDisabled = true;
		
		var promises = [
	        $q.all([
	            datacontext.participant.getOwnerById(config.owner.ownerId),
	            datacontext.participant.getParticipantById(config.owner.houseId),
	        ])
	            .then(function(output){
	                var owner = output[0];
	                var house = output[1];
	                $scope.owner = owner;
	                Stripe.setPublishableKey(owner.stripePublishableKey);
	                $('#terms').popover({ title: "Terms and Conditions", html: true, content: function () { msg = '<div id="popover_content_wrapper"><p>' + owner.termsText + '</p></div>'; return $(msg).html(); }, placement: 'auto', container: 'body', trigger: 'click' });
	                $('#refund').popover({ title: "Refund Policy", html: true, content: function () { msg = '<div id="popover_content_wrapper"><p>' + owner.refundsText + '</p></div>'; return $(msg).html(); }, placement: 'auto', container: 'body', trigger: 'click' });
				
	                $scope.house = house;	
	            })
	            .finally(function(){
	                cart.processCartRules();
	                $scope.submitDisabled = false;
	            })
		];
			
		common.activateController(promises, controllerId);
        
        $scope.applyCoupon = function () {
			
            $scope.submitDisabled = true;
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
                        $scope.couponErrors = result.Message;
                    }
                })
                .error(function (data, status, headers, config) {
                    $scope.couponErrors = "Coupon Not Found(E1)";
                })
                .finally(function(){
                    $scope.submitDisabled = false;
                });
        };

        $scope.removeCoupons = function() {
            cart.removeCoupons();
            $scope.couponCode = "";
        };

        $scope.completeRegistration = function(){
            //var $form = $('#payment-form');

            $scope.errorMessage = "";  //clears any previous errors
            $scope.submitDisabled = true; // Disable the submit button to prevent repeated clicks

            //stripeSuccessHandler('asdfasdfasdfasf');
            //             Stripe.createToken($form)
            // .then(stripeSuccessHandler)
            // .catch(stripeErrorHandler)
            // .finally(function(){
            // 	// $("#overlay").removeClass("hidden");
            // 	$scope.submitDisabled = false;
            // });
        };

        $scope.checkout = function() {
            var order = {
                'orderName': $scope.house.firstName + " " + $scope.house.lastName,
                'orderEmail': $scope.house.email,
                'orderAmount': cart.getTotalPrice(),
                'orderHouseId': $scope.house.id,
                'ownerId': $scope.owner.id,
                'regs': cart.registrations,
                'charges': cart.surcharges
            };
            stripe.checkout(cart.getTotalPrice(), order);
        };

        $scope.isConfirm = function () {
            return $scope.isTerms && $scope.isRefund;
        };

        $scope.title = 'Event';
    }
	
	angular.module("evReg").controller(controllerId, ["$scope", "$http", "$location", "$q", "StripeService", "datacontext", "logger", "CartModel", "config", "common", Controller]);
	
})();