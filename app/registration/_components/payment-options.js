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
				scope.paymentAmmount = scope.price || 0;
				scope.paymentChange = function(){
					
				};
				
				scope.checkout = function(){
					
				};
			}
		};
		
		return out;
	}
	
	angular.module("evReg").directive("paymentOptions", Directive);
})();