(function () {
	'use strict';

	var controllerId = "ConfirmController";

	function Controller($scope, $http, $location, $q, $modal, stripe, datacontext, cart, config, common) {
		$scope.isTerms = false;
		$scope.isRefund = false;

		$scope.couponErrors = "";
		$scope.cart = cart;
		$scope.allowPartialPayment = false;
		$scope.allowZeroPayment = false;

		$scope.eventureName = cart.regSettings.eventureName;
		$scope.listName = cart.regSettings.listName;

		$scope.termsText = cart.regSettings.termsText;
		$scope.refundsText = cart.regSettings.refundsText;
		
		// initialize it
		$scope.paymentOptions = {
			showSelector : config.owner.isAdmin,
			allowZeroPayment : false,
			buttonText : cart.regSettings.confirmButtonText,
			submitDisabled : true,
		};

		var promises = [
			$q.all([datacontext.participant.getParticipantById(cart.ownerId)])
				.then(function (output) {
					var house = output[0];
					$scope.house = house;
					$('#terms').popover({
						title: "Terms and Conditions",
						html: true,
						content: function () {
							msg = '<div id="popover_content_wrapper"><p>' + cart.regSettings.termsText + '</p></div>';
							return $(msg).html();
						},
						placement: 'auto',
						container: 'body',
						trigger: 'click'
					});
					$('#refund').popover({
						title: "Refund Policy",
						html: true,
						content: function () {
							msg = '<div id="popover_content_wrapper"><p>' + cart.regSettings.refundsText + '</p></div>';
							return $(msg).html();
						},
						placement: 'auto',
						container: 'body',
						trigger: 'click'
					});
				})
				.finally(function () {
					cart.processCartRules();
					$scope.paymentOptions.submitDisabled = false;
				})
		];

		common.activateController(promises, controllerId);

		$scope.applyCoupon = function () {

			$scope.paymentOptions.submitDisabled = true;
			var apiUrl = config.apiPath + "api/coupon/Post"; //mjb
			var source = {
				'couponCode': $scope.couponCode,
				'regs': cart.registrations,
			};
			console.log(source);
			$http.post(config.apiPath + "api/coupon/Post", source)
				.success(function (result) {
					console.log(result);
					if (result.Amount !== 0) {
						cart.removeCoupons();
						console.log($scope.couponCode);
						console.log(result.Amount);
						console.log(result.CouponId);
						cart.addSurcharge('Coupon: ' + $scope.couponCode, result.Amount, 'coupon', 0, 0, result.CouponId);
						$scope.couponErrors = "";
					} else {
						$scope.couponErrors = result.Message;
					}
				})
				.error(function (data, status, headers, config) {
					$scope.couponErrors = "Coupon Not Found(E1)";
				})
				.finally(function () {
					$scope.paymentOptions.submitDisabled = false;
				});
		};

		$scope.removeCoupons = function () {
			cart.removeCoupons();
			$scope.couponCode = "";
		};

		$scope.openTerms = function () {
			var modalInstance = $modal.open({
				templateUrl: 'termsAndConditions.html',
				size: 'lg',
				backdrop: 'static',
				controller: 'TermsModalInstance'
			});
			modalInstance.result.then();
		};

		$scope.openRefund = function () {
			var modalInstance = $modal.open({
				templateUrl: 'refundPolicy.html',
				size: 'lg',
				backdrop: 'static',
				controller: 'TermsModalInstance'
			});
			modalInstance.result.then();
		};

		$scope.checkout = function (opts) {
			var order = cart.order();
			
			order.orderAmount = opts.amount;
			order.paymentType = opts.type;
			
			if(config.owner.isAdmin){
				order.manualPayment = true;
				order.notes = opts.notes;
			}
			
			var def;
			switch(opts.type){
			case "credit":
				if (order.orderAmount > 0) {
					def = stripe.checkout(order.orderAmmount)
						.then(function (res) {
							console.log(res);
							$.blockUI({
								message: 'Processing order...'
							});
							order.stripeToken = res.id;
							return $http.post(config.apiPath + "api/order/Post", order);
						}); //mjb
					
				} else {
					$.blockUI({
						message: 'Processing order...'
					});
					def = $http.post(config.apiPath + "api/order/PostZero", order); //mjb
				}
				break;
			default:
				$.blockUI({
					message: 'Processing order...'
				});
				def = $http.post(config.apiPath + "api/order/PostOther", order); 
				break;
			}
			
			def.then(function (reply) {
					var result = reply.data;
					cart.emptyCart();
					$location.path("/orderreceipt/" + result);
				})
				.catch(function (err) {
					console.log("ERROR:", err.toString());
					$scope.stripeError = 'ERROR: ' + err.toString();
				})
				.finally(function () {
					$.unblockUI();
				});
				
			return def;
		};

		$scope.isConfirm = function () {
			return $scope.isTerms && $scope.isRefund;
		};
		
		$scope.title = 'Event';
	}
	angular.module("evReg").controller(controllerId, ["$scope", "$http", "$location", "$q", "$modal", "StripeService", "datacontext", "CartModel", "config", "common", Controller]);
})();
