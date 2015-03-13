;(function(){
	
	// opts.showSelector
	// opts.allowZeroPayment
	// opts.buttonText
	
	// paymentAdjustment
	// paymentAmmount
	// paymentNotes
	
	// fullPaymentUnderstanding
	// waiverSigned
	// submitDisabled
	
	// Checkout
	
	function Directive(){
		var out = {
			restrict : "E",
			scope: {
				opts : "=paymentOpts",
				error : "=paymentError",
				submit: "=paymentSubmit",
				price: "=paymentPrice",
			},
			templateUrl : "/app/registration/_components/payment-options.part.html",
			link: function(scope, el, attrs) {
				scope.paymentEnabled = "credit";
				
				scope.paymentChange = function(){
					scope.paymentAmmount = (scope.price || 0) - (Number(scope.paymentAdjustment) || 0);
				};
				
				scope.$watch("price", function(newOne, oldOne){
					scope.paymentChange();
				});
				
				scope.checkout = function(){
					var opts = {
						amount : scope.paymentAmmount,
						type : scope.paymentEnabled,
						waiverSigned : scope.waiverSigned,
						notes: scope.otherPaymentNotes,
					};
					
					return scope.submit(opts);
				};
			}
		};
		
		return out;
	}
	
	angular.module("evReg").directive("paymentOptions", Directive);
})();