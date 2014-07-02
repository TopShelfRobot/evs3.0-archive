(function() {

	function Service($q) {

		var service = {};

		service.setPublishableKey = function(key) {
			Stripe.setPublishableKey(key)
		};

		service.createToken = function(form) {
			console.log("stripe create token form:", form);
			var deferred = $q.defer();

			Stripe.createToken(form, function(status, response) {
				if (response.error) {
					deferred.reject(response.error.message, response);
				} else {
					deferred.resolve(response.id, response)
				}
			});
			return deferred;
		};

		return service;
	}

	angular.module("app").service("StripeService", ["$q", Service]);

})();
