;(function(){
	
	var controllerId = "EditRegistration";
	
	function Controller($routeParams, $q, model, datacontext, common, config){
		var self = this;
		this.showDefer = false;
		this.showTransfer = false;
		this.newListing = null;
		this.model = model;
		
		this.loadTransfer = function(){
			self.showDefer = false;
			self.showTransfer = true;
		};
		
		this.loadDefer = function(){
			self.showDefer = true;
			self.showTransfer = false;
		};
		
		this.cancel = function(){
			console.log("cancel");
		};
		
		this.cancelTransfer = function(){
			self.newListing = null;
			self.showTransfer = false;
		};
		
		this.cancelDefer = function(){
			self.showDefer = false;
		};
		
		this.submitTransfer = function(){
			self.model.setTransfer(self.newListing);
			
		};
		
		this.submitDefer = function(){
			self.model.setDefer();
		};
		
		common.activateController(model.load($routeParams.regId), controllerId);
	}
	
	angular.module("evReg").controller(controllerId, ["$routeParams", "$q", "RegistrationEditModel", "datacontext", "common", "config", Controller]);
	
})();