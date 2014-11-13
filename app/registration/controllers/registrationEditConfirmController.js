;(function(){
	
	var controllerId = "RegistrationEditConfirm";
	
	function Controller($http, $routeParams, $q, config, model, stripe){
		var self = this;
		var paymentUrl = config.apiPath + "/api/Payment/PostRegistrationEditPayment";
		
		this.regId = $routeParams.regId;
		model.load(self.regId);
		this.isAdmin = config.owner.isAdmin;
		this.paymentEnabled = 'credit';
		
		console.log("model:", model);
		this.model = model;
		
		this.otherPaymentAdjustment = 0;
		this.otherPaymentAmmount = 0;
		
		this.otherPaymentChange = function(){
			self.otherPaymentAmmount = Number(model.getTotalPrice()) + Number(self.otherPaymentAdjustment);
		};
		this.otherPaymentChange();
		
		var process = function (token, total, type){
			$.blockUI({ message: 'Processing order...' });
			var nextUrl;
			var def; 
			if(model.isDefer){
				def =  model.submitDeferral(token, total, type)
					.then(function (result) {
						nextUrl = "/receipt/" + result;
						return null;
	                });
			}else{
				def =  model.submitTransfer(token, total, type)
					.then(function (result) {
						nextUrl = "/receipt/" + result;
						return model.saveAnswers()
	                });
			}
			
            def.then(function(){
				$location.path(nextUrl);
				return null;
			})
			.catch(function (err) {
				console.error("ERROR:", err.toString());
			})
			.finally(function () {
				$.unblockUI();
			});
			return def;
		};
				
		this.submitPayment = function(type){
			var total = self.otherPaymentAmmount;
			
			switch(type){
			case "credit":
				stripe.checkout(total)
	                .then(function(res){
	                	return process(res.id, total, type);
	                });
				break;
			default:
				process(null, total, type);
				break;
			}
		};
	}
	
	angular.module("evReg").controller(controllerId, ["$http", "$routeParams", "$q", "config", "RegistrationEditModel", "StripeService", Controller]);
})();