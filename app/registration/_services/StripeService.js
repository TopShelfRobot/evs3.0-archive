(function() {
	angular.module("evReg").service("StripeService", ["$q", "config", "CartModel", Service]);

	function Service($q, config, cart) {

		var service = {};

		service.checkout = function(userPaying, email) {

			var deferred = $q.defer();

			var token = function(res) {
				var $input = $('<input type=hidden name=stripeToken />').val(res.id);
				deferred.resolve(res);
			};

			//console.log(cart.regSettings.stripePublishableKey);
			StripeCheckout.open({
				key: cart.regSettings.stripePublishableKey,
				address: false,
				amount: userPaying * 100, //** expects an integer **/
				currency: 'usd',
				name: cart.regSettings.name,
				description: cart.regSettings.stripeOrderDescription,
				panelLabel: cart.regSettings.stripeCheckoutButtonText,
				email: email,
				//image: cart.regSettings.stripeLogoPath,
				token: token
			});
			return deferred.promise;
		};
		return service;
	}
})();
