
(function () {
	'use strict';

	var controllerId = "ConfirmController";

	function Controller($scope, $http, $location, $q, stripe, datacontext, logger, cart, config, common) {
		$scope.isTerms = false;
		$scope.isRefund = false;
		//$scope.owner = null;

		$scope.couponErrors = "";
		$scope.cart = cart;
		$scope.allowPartialPayment = false;
		$scope.allowZeroPayment = false;

		$scope.eventureName = cart.regSettings.eventureName;
		$scope.listName = cart.regSettings.listName;

		// initialize it
		$scope.submitDisabled = true;
		console.log('in confirm');
		console.log(cart.ownerId);
		console.log(cart.regSettings.eventureName);
		console.log(cart.regSettings);

		var promises = [
			$q.all([datacontext.participant.getParticipantById(cart.ownerId)])     //datacontext.participant.getOwnerById(cart.ownerId),
				.then(function (output) {
				    //var owner = output[0];
				    //$scope.owner = owner;
				    var house = output[0];
				    $scope.house = house;
					//Stripe.setPublishableKey(owner.stripePublishableKey);
					$('#terms').popover({ title: "Terms and Conditions", html: true, content: function () { msg = '<div id="popover_content_wrapper"><p>' + cart.regSettings.termsText + '</p></div>'; return $(msg).html(); }, placement: 'auto', container: 'body', trigger: 'click' });
					$('#refund').popover({ title: "Refund Policy", html: true, content: function () { msg = '<div id="popover_content_wrapper"><p>' + cart.regSettings.refundsText + '</p></div>'; return $(msg).html(); }, placement: 'auto', container: 'body', trigger: 'click' });
				})
				.finally(function () {
				    //alert('getting ready to process cart ruls');
					cart.processCartRules();
					console.log(cart.registrations);
					console.log(cart.surcharges);
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

			$http({ type: "POST", url: apiUrl, data: source })
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
				.finally(function () {
					$scope.submitDisabled = false;
				});
		};

		$scope.removeCoupons = function () {
			cart.removeCoupons();
			$scope.couponCode = "";
		};

		//$scope.completeRegistration = function(){
		//    $scope.errorMessage = "";  //clears any previous errors
		//    $scope.submitDisabled = true; // Disable the submit button to prevent repeated clicks
		//};

		$scope.checkout = function () {
			var order = cart.order();

			stripe.checkout(cart.getTotalPrice())
				.then(function (res) {
					console.log(res);
					$.blockUI({ message: 'Processing order...' });
					order.stripeToken = res.id;
					//$http.post(config.apiPath + "/api/Payment/Post", order)
					$http.post(config.apiPath + "api/order/Post", order)   //mjb
						.success(function (result) {
							//console.log("result: " + result);
							$location.path("/orderreceipt/" + result);
						})
						.error(function (err) {
							console.log("ERROR:", err.toString());
						})
						.finally(function () {
							$.unblockUI();
						});
				});
		};

		$scope.isConfirm = function () {
			return $scope.isTerms && $scope.isRefund;
		};
		$scope.title = 'Event';
	}

	angular.module("evReg").controller(controllerId, ["$scope", "$http", "$location", "$q", "StripeService", "datacontext", "logger", "CartModel", "config", "common", Controller]);

})();