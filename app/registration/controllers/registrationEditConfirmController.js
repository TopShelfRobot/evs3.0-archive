;(function(){
	
	var controllerId = "RegistrationEditConfirm";
	
	function Controller($http, $routeParams, config, model, stripe){
		var self = this;
		var paymentUrl = config.apiPath + "/api/Payment/PostRegistrationEditPayment";
		
		this.regId = $routeParams.regId;
		model.load(self.regId);
		this.isAdmin = config.isAdmin;
		this.paymentEnabled = 'credit';
		
		console.log("model:", model);
		this.model = model;
				
		this.getOrder = function(){
			return {};
		};
		
		this.submitPayment = function(){
			var total = self.getTotalPrice();
			var cartOrder = self.getOrder();
			
				stripe.checkout(total)
                .then(function (res) {
					$.blockUI({ message: 'Processing order...' });
                    console.log(res);
                    cartOrder.orderToken = res.id;
                    $http.post(paymentUrl, cartOrder)
                       .success(function (result) {
                           $location.path("/receipt/" + result);
                       })
                        .error(function (err) {
                            console.error("ERROR:", err.toString());
                        })
                        .finally(function () {
                            $.unblockUI();
                        });
                });
		};
	}
	
	angular.module("evReg").controller(controllerId, ["$http", "$routeParams", "config", "RegistrationEditModel", "StripeService", Controller]);
})();