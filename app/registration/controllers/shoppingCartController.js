(function(){
	
	var controllerId = "ShoppingCart";
	
	function Controller($location, model){
		var self = this;
		this.model = model;
		
		this.removeItem = function(reg){
			self.model.removeRegistration(reg);
		};
		
		this.checkout = function(){
			console.log("checking out");
			$location.path("/confirm");
		};
	}
	
	angular.module("evReg").controller(controllerId, ["$location", "CartModel", Controller]);
})();