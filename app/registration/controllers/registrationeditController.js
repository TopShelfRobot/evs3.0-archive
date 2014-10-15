;(function(){
	
	var controllerId = "EditRegistration";
	
	function Controller(datacontext, common){
		var self = this;
		this.showDefer = false;
		this.showTransfer = false;
		
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
	}
	
	angular.module("evReg").controller(controllerId, ["datacontext", "common", Controller]);
	
})();