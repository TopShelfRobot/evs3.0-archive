;(function(){
	
	var controllerId = "RegistrationEditConfirm";
	
	function Controller($http, $routeParams, $q, config, model, stripe){
		var self = this;
		var paymentUrl = config.apiPath + "/api/Payment/PostRegistrationEditPayment";
		
		this.regId = $routeParams.regId;
		model.load(self.regId);
		
		console.log("model:", model);
		this.model = model;
				
		this.stripeError = "";
		
		// initialize it
		this.paymentOptions = {
			showSelector : config.owner.isAdmin,
			allowZeroPayment : false,
			submitDisabled : false,
		};
		
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
						return model.transferAnswers();
						// return model.saveAnswers();
          });
			}
			
      def
				.then(function(){
					$location.path(nextUrl);
					return null;
				})
				.catch(function (err) {
					console.error("ERROR:", err.data.message.toString());
					self.stripeError = "ERROR:" + err.data.message.toString();
				})
				.finally(function () {
					$.unblockUI();
				});
			return def;
		};
				
		this.submitPayment = function(opts){
			var total = opts.amount;
			var type = opts.type;
			
			switch(type){
			case "credit":
				if(total > 0){
					stripe.checkout(total)
            .then(function(res){
            	return process(res.id, total, type);
            });
				}else{
					return process(null, total, type);
				}
				break;
			default:
				process(null, total, type);
				break;
			}
		};
	}
	
	angular.module("evReg").controller(controllerId, ["$http", "$routeParams", "$q", "config", "RegistrationEditModel", "StripeService", Controller]);
})();